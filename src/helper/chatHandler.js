// use these function for chat // handlers/chatSocketHandlers.js
import mongoose from "mongoose";
import Chat from "../models/Chat";
import Message from "../models/Message";

const onlineUsers = {};

const chatSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join_room", async (data) => {
      try {
        socket.join(data);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("send_message", async (data, callback) => {
      console.log(data, "Message");

      try {
        if (!data.senderId || !data.content || !data.chatId) {
          if (typeof callback === "function") {
            return callback("Invalid data sent.");
          }
        }

        if (!mongoose.Types.ObjectId.isValid(data.senderId)) {
          if (typeof callback === "function") {
            return callback("Invalid senderId format.");
          }
        }

        const newMessage = new Message({
          content: data.content,
          sender: data.senderId,
          chat: data.chatId,
          timestamp: new Date(),
          status: "sent", // Initially set the status to "sent"
          readBy: [],
        });

        await newMessage.save();

        try {
          const updatedChat = await Chat.findOneAndUpdate(
            { _id: data.chatId },
            { $push: { messages: newMessage._id } },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error updating Chat:", error);
        }

        const messageData = {
          chatId: data.chatId,
          senderId: newMessage.sender,
          content: newMessage.content,
          time: newMessage.timestamp,
          status: newMessage.status,
          readBy: newMessage.readBy,
        };

        // Emit the message to the room
        io.to(data.chatId).emit("receive_message", messageData);

        // Emit the message status to inform clients
        io.to(data.chatId).emit("message_status", {
          messageId: newMessage._id,
          status: newMessage.status,
        });

        // Mark the message as unread for all users in the room except the sender
        socket.to(data.chatId).emit("mark_as_unread", {
          messageId: newMessage._id,
          senderId: newMessage.sender,
        });

        if (typeof callback === "function") {
          callback(null, "Message sent successfully.");
        }
      } catch (error) {
        console.error("Error while sending message:", error);
        if (typeof callback === "function") {
          callback("Error while sending message.");
        }
      }
    });

    socket.on("mark_as_read", async (data) => {
      try {
        await Message.findByIdAndUpdate(data.messageId, {
          $set: {
            status: "read",
          },
          $push: {
            readBy: data.readerId,
          },
        });

        // Emit the message status to inform clients
        io.to(data.chatId).emit("message_status", {
          messageId: data.messageId,
          status: "read",
        });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    socket.on("fetch_messages", async (chatId) => {
      try {
        const chat = await Chat.findById(chatId).populate({
          path: "messages",
          populate: { path: "sender", model: "User" },
        });

        if (chat) {
          socket.emit("past_messages", {
            chatId: chatId,
            messages: chat.messages,
          });
        } else {
          socket.emit("error", {
            message: Chat not found with ID: ${chatId}.,
          });
        }
      } catch (error) {
        console.error("Error fetching past messages:", error);
        socket.emit("error", {
          message: Error fetching messages: ${error.message},
        });
      }
    });

    socket.on("typing_start", (data) => {
      console.log(data, "typing");
      socket.broadcast.to(data.chatId).emit("user_typing", {
        chatId: data.chatId,
        username: data.username,
      });
    });

    socket.on("typing_end", (data) => {
      socket.broadcast.to(data.chatId).emit("user_stopped_typing", {
        chatId: data.chatId,
        username: data.username,
      });
    });

    socket.on("user_online", ({ chatid, name }) => {
      console.log("chatid", chatid);
      console.log("name", name);

      onlineUsers[socket.id] = { chatid, name };
      io.emit("update_online_users", Object.values(onlineUsers));
    });

    // Add "edit_message" event
    socket.on("edit_message", async (data, callback) => {
      try {
        // Find the message by ID and update its edited content
        const message = await Message.findByIdAndUpdate(data.messageId, {
          editedContent: data.content,
        });

        // Broadcast to the room that the message has been edited
        io.to(data.chatId).emit("message_edited", {
          messageId: data.messageId,
          editedContent: data.content,
        });

        if (typeof callback === "function") {
          callback(null, "Message edited successfully.");
        }
      } catch (error) {
        console.error("Error editing message:", error);
        if (typeof callback === "function") {
          callback("Error editing message.");
        }
      }
    });

    // Add "delete_message" event
    socket.on("delete_message", async (data, callback) => {
      try {
        // Find the message by ID and remove it from the database
        const deletedMessage = await Message.findByIdAndRemove(data.messageId);

        // Broadcast to the room that the message has been deleted
        io.to(data.chatId).emit("message_deleted", {
          messageId: data.messageId,
        });

        if (typeof callback === "function") {
          callback(null, "Message deleted successfully.");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        if (typeof callback === "function") {
          callback("Error deleting message.");
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};

export default chatSocketHandlers;