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
  regular:
    Platform?.OS === "ios"
      ? "Clarika Pro Geometric Medium"
      : "clarika-pro-geometric-regular",
  bold:
    Platform?.OS === "ios"
      ? "Clarika Pro Geometric Heavy"
      : "clarika-pro-geometric-bold",
  extra_bold:
    Platform?.OS === "ios"
      ? "Clarika Pro Geometric Black"
      : "clarika-pro-geometric-extraBold",
  medium:
    Platform?.OS === "ios"
      ? "Clarika Pro Geometric Demi"
      : "clarika-pro-geometric-medium",
  semi_bold:
    Platform?.OS === "ios"
      ? "Clarika Pro Geometric Bold"
      : "clarika-pro-geo-metric-semi-bold",
};
