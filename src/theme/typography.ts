import {TextStyle} from 'react-native';

/** Kieu chu dung chung. Component lay tu day, khong tu dat co chu. */
const typography = {
  h1: {fontSize: 24, fontWeight: '700'} as TextStyle,
  h2: {fontSize: 20, fontWeight: '700'} as TextStyle,
  h3: {fontSize: 17, fontWeight: '700'} as TextStyle,
  body: {fontSize: 15, fontWeight: '400'} as TextStyle,
  bodyBold: {fontSize: 15, fontWeight: '600'} as TextStyle,
  caption: {fontSize: 13, fontWeight: '400'} as TextStyle,
  captionBold: {fontSize: 13, fontWeight: '600'} as TextStyle,
  small: {fontSize: 11, fontWeight: '600'} as TextStyle,
};

export default typography;
