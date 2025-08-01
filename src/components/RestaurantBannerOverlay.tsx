import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useColorModeValue } from 'native-base';
import { IconClock, IconPlugX } from '@tabler/icons-react-native';
import i18n from '../i18n';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '16/9',
    color: 'white',
  },
  label: {
    fontWeight: 500,
    fontSize: 16,
    color: 'white',
  },
});

function RestaurantBannerOverlay({ children }) {
  const overlayBackgroundColor = useColorModeValue(
    'rgba(0,0,0,0.5)',
    'rgba(0,0,0,0.75)',
  );

  return (
    <View style={[styles.overlay, { backgroundColor: overlayBackgroundColor }]}>
      {children}
    </View>
  );
}

export function RestaurantNotAvailableBannerOverlay() {
  return (
    <RestaurantBannerOverlay>
      <IconPlugX size={32} color={'white'} strokeWidth={1.5} />
      <Text style={styles.label} numberOfLines={1}>
        {i18n.t('NOT_AVAILABLE_ATM')}
      </Text>
    </RestaurantBannerOverlay>
  );
}

export function PreOrderBannerOverlay() {
  return (
    <RestaurantBannerOverlay>
      <IconClock color={'white'} strokeWidth={3} size={17} />
      <Text style={styles.label} numberOfLines={1}>
        {i18n.t('RESTAURANT_PRE_ORDER')}
      </Text>
    </RestaurantBannerOverlay>
  );
}
