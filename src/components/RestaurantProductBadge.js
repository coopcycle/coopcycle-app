import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import i18n from '../i18n';

const styles = StyleSheet.create({
  badge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'hsla(136, 85%, 34%, 0.1)',
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingLeft: 4,
  },
  badgeText: {
    color: 'hsla(136, 85%, 34%, 1)',
    fontSize: 8,
    marginTop: -1,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    verticalAlign: 'middle',
  },
});

function RestaurantProductBadge({ type }) {
  const value = i18n.t(`RESTRICTED_DIET.${type}`);
  return (
    <View style={styles.badge}>
      <Svg
        xmlns="http://www.w3.org/2000/Svg"
        class="icon icon-tabler icon-tabler-leaf"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="hsla(136, 85%, 34%, 1)"
        stroke-linecap="round"
        stroke-linejoin="round">
        <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <Path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" />
        <Path d="M5 21c.5 -4.5 2.5 -8 7 -10" />
      </Svg>
      <Text style={styles.badgeText}>{value}</Text>
    </View>
  );
}

export default RestaurantProductBadge;
