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
  },
});

function RestaurantProductBadge({ name, color, backgroundColor, icon }) {
  const value = i18next.t(name);
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      {icon}
      <Text style={[styles.badgeText, { color, fontSize: 10 }]}>{value}</Text>
    </View>
  );
}

export function DietBadge({ name }) {
  const color = 'hsl(136, 85%, 25%)';
  const backgroundColor = 'hsla(136, 85%, 35%, 0.1)';
  const icon = <IconLeaf stroke={color} size={14} />;
  return (
    <RestaurantProductBadge
      name={`RESTRICTED_DIET.${name}`}
      color={color}
      backgroundColor={backgroundColor}
      icon={icon}
    />
  );
}

export function AllergenBadge({ name }) {
  const color = 'hsl(60, 92%, 25%)';
  const backgroundColor = 'hsla(60, 82%, 35%, 0.1)';
  const icon = <IconExclamationCircle stroke={color} size={14} />;
  return (
    <RestaurantProductBadge
      name={`ALLERGEN.${name}`}
      color={color}
      backgroundColor={backgroundColor}
      icon={icon}
    />
  );
}

export function ZeroWasteBadge() {
  const color = 'hsl(158, 62%, 25%)';
  const backgroundColor = 'hsla(158, 62%, 35%, 0.1)';
  const icon = <IconRecycle stroke={color} size={14} />;
  return (
    <RestaurantProductBadge
      name={'ZERO_WASTE'}
      color={color}
      backgroundColor={backgroundColor}
      icon={icon}
    />
  );
}
