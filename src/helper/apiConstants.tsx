export const api = {
  BASE_URL: "https://api.mystylist.in/",
  IMG_URL: "https://mystylist-media.s3.amazonaws.com/",
  IMG_URL_2: "https://mystylist-media.s3.amazonaws.com",
  MAP_KEY: "ZaOomNd4Sw75MeonHoR4UAAC5I5KiqeW0bL2uYv6",

  // Auth
  login: "login",
  logout: "logout",
  send_verify_code: "user/user-login",
  verify_OTP: "user/verify-otp",
  city: "city/getAllCityNameForMobile",
  refresh_device_token: "user/updateMobileToken",
  auth_refresh_token: "user/refresh-token",
  // Home
  allServices: "service/getAllServices",
  allbanners: "banner/getAllBannerForExpert/Top/Home",
  allServicesForMaleAndFemale: "service/getAllServicesForMaleAndFemale/",
  allSubServicesForMobile: "service/getAllSubServicesForMobile",
  usersByLocation: "user/getUsersByLocation",
  allExpertBySubService: "user/getAllExpertBySubService",
  search: "service/getAllSubServicesSearch",
  searchUserName: "user/getAllUserName",
  deeplink: "deeplink/getdeeplink",
  // cart
  cart: "cart/addToCart",
  removeTocart: "cart/removeCartItem",
  getCart: "cart/getCartList",
  removeMultipleCartItems: "cart/removeMultipleCartItems",
  bookAppointments: "appointment/addAppointment?=&=",
  getAllServicesForMobile: "service/getAllServicesForMobile",
  cartTimeSlot: "cart/updateCartTimeSlot",

  //Profile
  FAQ: "faq/getAllFAQ",
  termsandconditions: "cms/getCMSPageForMobile/",
  userDetails: "user/getUserDetails",
  editProfile: "user/edit-profile",
  deleteProfile: "user/deleteAccount",

  //Map
  location: "user/getUsersByLocation",
  updatelocation: "user/updateUserLocation",
  adduserAddress: "user/updateUserAddress",
  searchAddress: "user/searchAddress",

  //Offers
  getAllOffersByUser: "generateOffer/getAllOffersByUser/",
  getAllOffers: "generateOffer/getAllOffers",
  allOffersByLocation: "generateOffer/getAllOffersByLocation",
  offerDetails: "generateOffer/getOfferDetails/",

  //Pakages
  getAllPackageByUser: "generatePackage/getAllPackageByUser/",
  getAllPackages: "generatePackage/getAllPackages",
  allPackageByLocation: "generatePackage/getAllPackageByLocation",

  // favourite
  getUsersFavList: "favourite/getUsersFavList",
  saveAsfavourite: "favourite/saveAsfavourite",
  removeAsfavourite: "favourite/removefav",

  // Appointments
  userAppointments: "appointment/getUserAppointments",
  appointmentDetails: "appointment/getAppointmentDetails/",
  expertAvailability: "expertUnavailability/getExpertAvailability",
  writeReviews: "review/writeReviews",
  cancelAppointment: "appointment/cancelAppointment?=&=",
  reschedule: "appointment/rescheduleAppointment",
  get_review: "review/getAllExpertReview/",

  reason: "reason/getReasonList",
  cancelReason: "reason/cancelReason",

  // campaign/getCampaignExpert
  campaignExpert: "campaign/getCampaignExpert",

  // chat
  chatParticipants: "user/getUsersList/",
  room: "user/createRoom",
  messagesReads: `chat/messagesRead`,
  unreadlist: `user/getChatsWithUnreadMessagesFromOthers`,

  // Address
  userAddresses: "user/getUserAddresses",
  unsetUserAddress: "user/UnsetUserAddress",
  editUserAddress: "user/EditUserAddress",

  //Notification
  notification: "notification/getAllNotifications",
};

export const POST = "POST";
export const GET = "GET";
