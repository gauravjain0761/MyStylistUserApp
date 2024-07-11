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
  regular: "clarika_pro_geometric_demi",
  black: "clarika_pro_geometric_demi",
  bold: "clarika_pro_geometric_demi",
  extra_bold: "clarika_pro_geometric_demi",
  extra_light: "clarika_pro_geometric_demi",
  light: "clarika_pro_geometric_demi",
  medium: "clarika_pro_geometric_demi",
  semi_bold: "clarika_pro_geometric_demi",
  thin: "clarika_pro_geometric_demi",
};
