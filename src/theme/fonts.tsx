import { Platform, TextStyle } from "react-native";
import { fontSize } from "../helper/globalFunction";

export function commonFontStyle(
  fontFamily: string,
  size: number,
  color: string
): TextStyle {
  return {
    fontFamily: fontFamily,
    fontSize: fontSize(size),
    color: color,
    includeFontPadding: false,
  };
}

export const fontFamily = {
  regular: "Poppins-Regular",
  bold: "Poppins-Bold",
  extra_bold: "Poppins-ExtraBold",
  medium: "Poppins-Medium",
  semi_bold: "Poppins-SemiBold",
};
