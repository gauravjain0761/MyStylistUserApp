import { TextStyle } from "react-native";
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
  regular: "Inter-Regular",
  black: "Inter-Black",
  bold: "Inter-Bold",
  extra_bold: "Inter-ExtraBold",
  extra_light: "Inter-ExtraLight",
  light: "Inter-Light",
  medium: "Inter-Medium",
  semi_bold: "Inter-SemiBold",
  thin: "Inter-Thin",
};
