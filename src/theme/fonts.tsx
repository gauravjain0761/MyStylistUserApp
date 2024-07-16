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
  regular: "clarika-pro-geometric-regular",
  bold: "clarika-pro-geometric-bold",
  extra_bold: "clarika-pro-geometric-extraBold",
  medium: "clarika-pro-geometric-medium",
  semi_bold: "clarika-pro-geo-metric-semi-bold",
};
