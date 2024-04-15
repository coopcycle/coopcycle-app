import { StyleSheet } from 'react-native';
import { Badge, HStack, Icon, Text, useColorModeValue } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  getNextShippingTimeAsText,
  getRestaurantIsAvailable,
  shouldShowPreOrder,
} from '../../../utils/checkout';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 600,
    marginLeft: 4,
  },
  badgeTextPreOrder: {
    fontSize: 14,
    fontWeight: 400,
    marginLeft: 4,
  },
});

export const CategoryBadge = ({ label }) => {
  // styled via theme
  return (
    <Badge variant="subtle" mr="1">
      {label}
    </Badge>
  );
};

export const TimingBadge = ({ restaurant }) => {
  const color = useColorModeValue('#000', '#fff');

  const isClosed = getRestaurantIsAvailable(restaurant);
  const shippingTime = getNextShippingTimeAsText(restaurant);
  const showPreOrder = shouldShowPreOrder(restaurant);

  return (
    <HStack style={[styles.badge]}>
      {showPreOrder ? (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={17}
          height={17}
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round">
          <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <Path d="M12 7v5l3 3" />
        </Svg>
      ) : !isClosed ? (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={19}
          height={17}
          fill={color}
          viewBox="0 0 18 11.38">
          <Path d="M14.52 4.41c-.29 0-.58.05-.85.12l-.72-2.23s-.02-.06-.04-.09v-.03l.8-.14v.47c0 .1.08.17.17.17h1c.1 0 .17-.08.17-.17V1.22c0-.2-.09-.39-.24-.53a.684.684 0 00-.55-.16l-2.49.43a.71.71 0 00-.49.37c-.07.15-.09.32-.05.48H6.52l-.29-.74h.86c.33 0 .59-.24.59-.54s-.27-.54-.59-.54h-2.1c-.33 0-.59.24-.59.54 0 .23.15.42.37.5l.56 1.44-.79 1.63a3.5 3.5 0 00-.97-.14c-1.98 0-3.58 1.66-3.58 3.7s1.61 3.7 3.58 3.7c1.66 0 3.07-1.19 3.47-2.79l.04.13c.07.25.27.44.52.49.25.05.5-.05.66-.25l3.8-5 .37 1.16c-.85.64-1.4 1.64-1.4 2.78 0 1.92 1.56 3.48 3.48 3.48s3.48-1.56 3.48-3.48-1.56-3.48-3.48-3.48zm2.17 3.48c0 1.19-.97 2.17-2.17 2.17s-2.17-.97-2.17-2.17.97-2.17 2.17-2.17 2.17.97 2.17 2.17zM5.83 7.67c0 1.28-1 2.32-2.24 2.32S1.35 8.95 1.35 7.67s1-2.32 2.24-2.32 2.24 1.04 2.24 2.32zM6.08 5c-.1-.1-.2-.19-.31-.27l.15-.31.16.58zm4.87-1.8L8.04 7.03 6.98 3.2h3.96z" />
        </Svg>
      ) : (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={22}
          height={22}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round">
          <Path d="M13.55 17.733a5.806 5.806 0 0 1 -7.356 -4.052a5.81 5.81 0 0 1 1.537 -5.627l2.054 -2.054l7.165 7.165" />
          <Path d="M4 20l3.5 -3.5" />
          <Path d="M15 4l-3.5 3.5" />
          <Path d="M20 9l-3.5 3.5" />
          <Path d="M16 16l4 4" />
          <Path d="M20 16l-4 4" />
        </Svg>
      )}

      <Text
        style={
          showPreOrder || isClosed ? styles.badgeTextPreOrder : styles.badgeText
        }>
        {shippingTime}
      </Text>
    </HStack>
  );
};
