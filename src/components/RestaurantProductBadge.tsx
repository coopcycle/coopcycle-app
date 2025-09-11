import {
  IconExclamationCircle,
  IconLeaf,
  IconRecycle,
} from '@tabler/icons-react-native';
import i18next from 'i18next';
import { useColorModeValue } from '../styles/theme';
import { Text } from '@/components/ui/text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
const allergenColor = 'hsl(60, 92%, 25%)';
const zeroWasteColor = 'hsl(158, 62%, 25%)';

const dietIcon = color => <IconLeaf stroke={color} size={iconSize} />;
const allergenIcon = color => (
  <IconExclamationCircle stroke={color} size={iconSize} />
);
const zeroWasteIcon = color => <IconRecycle stroke={color} size={iconSize} />;

function RestaurantProductBadge({ name, color, icon }) {
  color = useColorModeValue(
    color,
    color
      .replace(/25%\)/, '66%)')
      .replace(/,\s(\d+)%,\s/, (_, p) => ', ' + Math.floor(p) * 0.5 + '%, '),
  );
  const backgroundColor = useColorModeValue(
    color.replace(/hsl/, 'hsla').replace(/\)$/, ', 0.1)'),
    color.replace(/hsl/, 'hsla').replace(/\)$/, ', 0.15)'),
  );

  const value = i18next.t(name);
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      {icon(color)}
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
