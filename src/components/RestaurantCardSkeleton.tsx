import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';

const logoSize = 64;

// Deliberately a copy of RestaurantCard's layout rather than a reuse of it:
// what matters is that the two occupy the same space, so that nothing jumps
// when the real cards arrive.
//
// Every size here comes from a class or from a wrapping View, never from a
// `style` prop on Skeleton: Skeleton spreads its props over the Animated.View
// it pulses with, so a `style` would overwrite the animation.
const styles = StyleSheet.create({
  item: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 0,
  },
  // Sized here rather than through a class: these two carry the card's
  // geometry, and the skeleton is only useful if it matches it exactly.
  banner: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  logo: {
    width: logoSize,
    height: logoSize,
  },
  logoWrapper: {
    marginTop: -52,
    borderRadius: 16,
    marginLeft: 16,
    padding: 8,
    width: logoSize + 16,
  },
  content: {
    width: '100%',
    paddingTop: 8,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 12,
  },
  // Two lines' worth, as on the card itself.
  nameWrapper: {
    height: 48,
    justifyContent: 'flex-start',
  },
});

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const RestaurantCardSkeleton = ({ style }: Props) => (
  <Box className="bg-background-50" style={[styles.item, style]}>
    <View style={styles.banner}>
      <Skeleton className="rounded-none" />
    </View>
    <Box className="bg-background-50" style={styles.logoWrapper}>
      <View style={styles.logo}>
        <Skeleton className="rounded-lg" />
      </View>
    </Box>
    <View style={styles.content}>
      <View style={styles.nameWrapper}>
        <Skeleton className="h-6 w-3/4 rounded-md" />
      </View>
      {/* The timing badge, then the tags or the address. */}
      <Skeleton className="h-5 w-2/5 rounded-md" />
      <Skeleton className="h-4 w-3/5 rounded-md" />
    </View>
  </Box>
);
