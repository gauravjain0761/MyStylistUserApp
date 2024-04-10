import io from "socket.io-client";
import { api } from "./apiConstants";

let socket: any = null;
export { socket };

export const socketConnect = () => {
  if (socket !== null) {
    socket.disconnect();
  }
  console.log("trying to connect");
  socket = io(api.BASE_URL);
  // console.log(socket)
  socket.on("connect", () => {
    console.log("-----------socket connected-----------", socket);
    // dispatch({ type: 'SOCKET_CONNECTION', payload: socket.connected, socket: socket })
    // next(socket.connected)
  });

  socket.on("disconnect", () => {
    console.log("--socket disconnect-----------", socket);
  });
  socket.on("join_room", (res: any) => {
    console.log("join_room", res);
  });
  socket.on("send_message", (res: any) => {
    console.log("send_message", res);
  });
  socket.on("user_online", (res: any) => {
    console.log("user_online---", res);
  });
};
