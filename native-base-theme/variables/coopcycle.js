import material from './material'
import Config from 'react-native-config'

export default {
  ...material,
  fontFamily: 'OpenSans-Regular',
  footerDefaultBg: Config.PRIMARY_COLOR || '#e4022d',
  toolbarDefaultBg: Config.PRIMARY_COLOR || '#e4022d',
  titleFontfamily: 'Raleway-Regular',
  buttonFontFamily: 'Raleway-Regular',
  buttonUppercaseAndroidText: false,
};
