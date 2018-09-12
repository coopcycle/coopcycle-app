import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import material from '../native-base-theme/variables/material'


const transform = (tfs) => (o) =>
  Object.keys(o)
    .reduce((acc, k) => {
      if (tfs[k]) {
        acc[k] = tfs[k](o[k]);
      } else {
        acc[k] = o[k];
      }
      return acc;
    }, {})
;

const transformers = {
  // Badge
  badgePadding: moderateScale,

  // CheckBox
  CheckboxBorderWidth: scale,
  CheckboxPaddingLeft: moderateScale,
  CheckboxPaddingBottom: moderateScale,
  CheckboxIconSize: scale,
  CheckboxIconMarginTop: moderateScale,
  CheckboxFontSize: scale,
  DefaultFontSize: scale,
  checkboxSize: scale,

  // Font
  fontSizeBase: scale,

  // Footer
  footerHeight: verticalScale,
  footerPaddingBottom: moderateScale,

  // FooterTab
  tabBarTextSize: scale,

  // Header
  toolbarHeight: verticalScale,
  toolbarIconSize: scale,
  toolbarSearchIconSize: scale,
  searchBarHeight: verticalScale,

  // Icon
  iconFontSize: scale,
  iconMargin: moderateScale,
  iconHeaderSize: verticalScale,

  // InputGroup
  inputFontSize: scale,
  inputGroupMarginBottom: moderateScale,
  inputHeightBase: verticalScale,
  inputPaddingLeft: moderateScale,

  // Line Height
  btnLineHeight: scale,
  lineHeightH1: scale,
  lineHeightH2: scale,
  lineHeightH3: scale,
  iconLineHeight: scale,
  lineHeight: scale,

  // List
  listItemHeight: verticalScale,

  // Changed Variable
  listItemPadding: moderateScale,

  listNoteSize: scale,

  // Radio Button
  radioBtnSize: scale,

  // New Variable
  radioBtnLineHeight: scale,

  // Tabs
  tabFontSize: scale,

  // Text
  noteFontSize: scale,

  // Title
  titleFontSize: scale,
  subTitleFontSize: scale,

  // Other
  borderRadiusBase: scale,
  borderWidth: scale,
  contentPadding: moderateScale,

  inputLineHeight: scale,
  jumbotronPadding: moderateScale,

  // New Variable
  inputGroupRoundedBorderRadius: scale,
};

export default transform(transformers)(material);
