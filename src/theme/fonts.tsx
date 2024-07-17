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
  regular: "Clarika Pro Geometric Medium",
  bold: "Clarika Pro Geometric Heavy",
  extra_bold: "Clarika Pro Geometric Black",
  medium: "Clarika Pro Geometric Demi",
  semi_bold: "Clarika Pro Geometric Bold",
};
