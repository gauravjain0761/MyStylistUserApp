import {TextStyle} from 'react-native';
import {fontSize} from '../helper/globalFunction';

export function commonFontStyle(
  fontFamily: string,
  size: number,
  color: string,
): TextStyle {
  return {
    fontFamily: fontFamily,
    fontSize: fontSize(size),
    color: color,
    includeFontPadding: false,
  };
}
