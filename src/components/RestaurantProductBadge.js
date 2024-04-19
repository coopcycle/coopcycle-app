import {
  IconExclamationCircle,
  IconLeaf,
  IconRecycle,
} from '@tabler/icons-react-native';
import i18next from 'i18next';
import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  badge: {
    display: 'flex',
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingLeft: 4,
  },
  badgeText: {
    marginTop: -1,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    verticalAlign: 'middle',
    fontSize: 10,
  },
});

const iconSize = 14;
const dietColor = 'hsl(136, 85%, 25%)';
const dietIcon = <IconLeaf stroke={dietColor} size={iconSize} />;
const allergenColor = 'hsl(60, 92%, 25%)';
const allergenIcon = (
  <IconExclamationCircle stroke={allergenColor} size={iconSize} />
);
const zeroWasteColor = 'hsl(158, 62%, 25%)';
const zeroWasteIcon = <IconRecycle stroke={zeroWasteColor} size={iconSize} />;

function RestaurantProductBadge({ name, color, icon }) {
  const value = i18next.t(name);
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color
            .replace(/hsl/, 'hsla')
            .replace(/\)$/, ', 0.1)'),
        },
      ]}>
      {icon}
      <Text style={[styles.badgeText, { color }]}>{value}</Text>
    </View>
  );
}

export function DietBadge({ name }) {
  return (
    <RestaurantProductBadge
      name={`RESTRICTED_DIET.${name}`}
      color={dietColor}
      icon={dietIcon}
    />
  );
}

export function AllergenBadge({ name }) {
  return (
    <RestaurantProductBadge
      name={`ALLERGEN.${name}`}
      color={allergenColor}
      icon={allergenIcon}
    />
  );
}

export function ZeroWasteBadge() {
  return (
    <RestaurantProductBadge
      name={'ZERO_WASTE'}
      color={zeroWasteColor}
      icon={zeroWasteIcon}
    />
  );
}
