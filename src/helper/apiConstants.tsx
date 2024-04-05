export const api = {
  BASE_URL: "https://api.mystylist.in/",

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

  // cart
  cart: "cart/addToCart",
  removeTocart: "cart/removeCartItem",
  getCart: "cart/getCartList",
  bookAppointments: "appointment/addAppointment?=&=",

  //Profile
  FAQ: "faq/getAllFAQ",
  termsandconditions: "cms/getCMSPageForMobile/64fc1e863f161dd8548acb1e",
  userDetails: "user/getUserDetails",
  editProfile: "user/edit-profile",

  //Map
  location: "user/getUsersByLocation",
  updatelocation: "user/updateUserLocation",

  //Offers
  getAllOffersByUser: "generateOffer/getAllOffersByUser/",
  getAllOffers: "generateOffer/getAllOffers",
  allOffersByLocation: "generateOffer/getAllOffersByLocation",

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

  // campaign/getCampaignExpert
  campaignExpert: "campaign/getCampaignExpert",

  // chat
  chatParticipants: "chat/getChatParticipants",

  // Address
  userAddresses: "user/getUserAddresses",
  unsetUserAddress: "user/UnsetUserAddress",
  editUserAddress: "user/EditUserAddress",
};

export const POST = "POST";
export const GET = "GET";
