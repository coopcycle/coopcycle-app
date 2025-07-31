import {
  IconDiamondFilled,
  IconRecycle,
  IconSparkles,
} from '@tabler/icons-react-native';
import i18next from 'i18next';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function RestaurantBadge({ type }) {
  let backgroundColor = '#00F';
  let textColor = '#fff';
  let iconColor = '#fff';
  const iconSize = 17;
  let Icon;

  const ExclusiveIcon = (
    <IconDiamondFilled fill={iconColor} color={'none'} size={iconSize} />
  );

  const ZeroWasteIcon = (
    <IconRecycle color={iconColor} size={iconSize} strokeWidth={2.5} />
  );

  const NewIcon = (
    <IconSparkles color={iconColor} size={iconSize} strokeWidth={2.5} />
  );

  const EdenredIcon = (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={13}
      strokeWidth={2.5}
      fill="none"
      viewBox="0 0 39.93 44">
      <Path
        fill="#f72717"
        d="m33.48,6.45c-3.24-3.26-6.96-5.24-11.43-6.1-2-.4-5.22-.47-7.1-.17C10.83.82,6.66,2.7,3.66,5.27l-.59.52h7.96c7.46,0,7.96.02,7.96.29-.02.53-.83,5.38-.95,5.57-.07.1-2.43.17-6.91.17h-6.79v6.38h6.21c5.86,0,6.21.02,6.21.31,0,.17-.19,1.4-.43,2.72-.24,1.31-.43,2.45-.43,2.52,0,.09-2.6.14-5.79.14h-5.79l.07,2.28c.05,2.59.28,3.21,1.34,3.84.57.33.93.34,6.86.4,5.31.05,6.24.1,6.24.31,0,.26-.62,4.33-.79,5.12l-.1.48-7.34-.05c-7.21-.05-7.38-.07-8.33-.45-.53-.21-1.31-.62-1.71-.91-.91-.67-.72-.31.74,1.41,2,2.34,4.29,4.09,7.24,5.5,7.05,3.4,15.07,2.83,21.75-1.57.76-.5,2.19-1.72,3.19-2.72,2.71-2.72,4.29-5.29,5.41-8.81.81-2.5,1.03-4.02,1.03-6.72s-.22-4.22-1.03-6.72c-1.12-3.52-2.71-6.08-5.41-8.81Z"
      />
    </Svg>
  );

  Icon = ExclusiveIcon;

  switch (type) {
    case 'exclusive':
      backgroundColor = '#d7b722';
      textColor = '#fff';
      iconColor = '#fff';
      Icon = ExclusiveIcon;
      break;
    case 'zero-waste':
      backgroundColor = '#04b072';
      textColor = '#fff';
      iconColor = '#fff';
      Icon = ZeroWasteIcon;
      break;
    case 'new':
      backgroundColor = '#969fea';
      textColor = '#fff';
      iconColor = '#fff';
      Icon = NewIcon;
      break;
    case 'edenred':
      backgroundColor = '#fff';
      textColor = '#f72717';
      iconColor = '#f72717';
      Icon = EdenredIcon;
      break;
    case 'vytal':
      backgroundColor = '#fff';
      textColor = '#f72717';
      iconColor = '#fff';
      break;
  }

  const padding = 1;
  const styles = StyleSheet.create({
    badge: {
      backgroundColor: backgroundColor,
      borderRadius: 16,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 16,
      elevation: 4,
      display: 'inline-flex',
      overflow: 'hidden',
      position: 'relative',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: 1,
    },
    div: {
      backgroundColor: backgroundColor,
      borderRadius: 16,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      position: 'relative',
      paddingTop: 2 - padding,
      paddingRight: 12 - padding,
      paddingBottom: 2 - padding,
      paddingLeft: 8 - padding,
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: textColor,
      textTransform: 'capitalize',
      marginLeft: 4,
    },
  });

  const text = i18next.t(type.toUpperCase().replace(/-/, '_'));

  return (
    <View style={styles.badge}>
      <View style={styles.div}>
        {Icon}
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}
