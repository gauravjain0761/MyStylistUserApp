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

  //Profile
  FAQ: "faq/getAllFAQ",
  termsandconditions: "cms/getCMSPageForMobile/64fc1e863f161dd8548acb1e",

  //Map
  location: "user/getUsersByLocation",
  updatelocation: "user/updateUserLocation",

  //Offers
  getAllOffersByUser: "generateOffer/getAllOffersByUser/",

  //Pakages
  getAllPackageByUser: "generatePackage/getAllPackageByUser/",
};

export const POST = "POST";
export const GET = "GET";
