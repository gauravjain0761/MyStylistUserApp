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
  bold: "clarika_pro-geometric_bold",
  extra_bold: "clarika_pro_geometric_extraBold",
  medium: "clarika_pro_geometric_medium",
  semi_bold: "clarika_pro_geo_metric_semi_bold",
};
