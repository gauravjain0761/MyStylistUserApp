export const api = {
  BASE_URL: "https://api.mystylist.in/",
  IMG_URL: "https://mystylist-media.s3.amazonaws.com/",
  IMG_URL_2: "https://mystylist-media.s3.amazonaws.com",

  // Auth
  login: "login",
  logout: "logout",
  send_verify_code: "user/user-login",
  verify_OTP: "user/verify-otp",
  city: "city/getAllCityNameForMobile",

  // Home
  allServices: "service/getAllServices",
  allbanners: "banner/getAllBannerForUsers/Top",
  allServicesForMaleAndFemale: "service/getAllServicesForMaleAndFemale/",
  allSubServicesForMobile: "service/getAllSubServicesForMobile",
  usersByLocation: "user/getUsersByLocation",
  allExpertBySubService: "user/getAllExpertBySubService",
  search: "service/getAllSubServicesSearch",
  searchUserName: "user/getAllUserName",
  // cart
  cart: "cart/addToCart",
  removeTocart: "cart/removeCartItem",
  getCart: "cart/getCartList",
  removeMultipleCartItems: "cart/removeMultipleCartItems",
  bookAppointments: "appointment/addAppointment?=&=",

  //Profile
  FAQ: "faq/getAllFAQ",
  termsandconditions: "cms/getCMSPageForMobile/64fc1e863f161dd8548acb1e",
  userDetails: "user/getUserDetails",
  editProfile: "user/edit-profile",

  //Map
  location: "user/getUsersByLocation",
  updatelocation: "user/updateUserLocation",
  adduserAddress: "user/updateUserAddress",
  edituserAddress: "user/updateUserAddress",

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

  // campaign/getCampaignExpert
  campaignExpert: "campaign/getCampaignExpert",

  // chat
  chatParticipants: "chat/getChatParticipants",
  room: "user/createRoom",

  // Address
  userAddresses: "user/getUserAddresses",
  unsetUserAddress: "user/UnsetUserAddress",
  editUserAddress: "user/EditUserAddress",
};

export const POST = "POST";
export const GET = "GET";
