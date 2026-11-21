import React from 'react';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import {
  Image,
  StyleProp,
  StyleSheet,
  TextProps,
  View,
  ViewStyle,
} from 'react-native';
import { TimingBadge } from '../navigation/checkout/components/RestaurantBadges';
import { useGetRestaurantTimingQuery } from '../redux/api/slice';
import {
  hasShippingTime,
  isRestaurantOrderingAvailable,
} from '../utils/checkout';
import { useHasBeenVisible } from './VisibleItems';
import { RestaurantBadge } from './RestaurantBadge';
import { RestaurantTag } from './RestaurantTag';
import { RestaurantBanner } from './RestaurantBanner';
import { RestaurantNotAvailableBannerOverlay } from './RestaurantBannerOverlay';

const logoSize = 64;

const OneLineText = (props: TextProps) => (
  <Text
    numberOfLines={props.numberOfLines || 1}
    ellipsizeMode="tail"
    {...props}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 0,
  },
  images: {
    width: '100%',
  },
  logoWrapper: {
    marginTop: -52, // (logoSize + 16) * 64%
    borderRadius: 16,
    display: 'inline-flex',
    marginLeft: 16,
    padding: 8,
    position: 'relative',
    boxSizing: 'border-box',
    width: logoSize + 16,
  },
  logo: {
    width: logoSize,
    aspectRatio: '1',
    borderRadius: 8,
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 8,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 12,
  },
  nameWrapper: {
    // Two lines' worth, always. The banner is a fixed ratio and the rest of
    // the card is single-line, so pinning the name is what makes every card
    // the same height — without it, cards in a row have to stretch to match,
    // and a stretched card has no height of its own to be measured from.
    height: 48,
  },
  name: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
  },
  timing: {
    alignItems: 'center',
    alignSelf: 'left',
    borderRadius: 4,
  },
  badgesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    left: 0,
    padding: 12,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  details: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  detailsText: {
    fontSize: 14,
    opacity: 0.75,
  },
});

export type Restaurant = {
  '@id': string;
  name: string;
  // Set only when the shop was loaded with its timing already attached.
  timing?: object;
  description: string | null;
  address: {
    streetAddress: string;
  };
  image: string;
  bannerImage: string;
  badges: string[];
  // Translated cuisine names, for display.
  tags: string[];
  // The same cuisines, by name, which is what a cuisine filter matches on.
  // Absent on a shop that came from an older server.
  cuisines?: string[];
};

type Props = {
  restaurant: Restaurant;
  // Lets callers override the card's own margins, e.g. inside a horizontal row.
  style?: StyleProp<ViewStyle>;
};

export const RestaurantCard = ({ restaurant, style }: Props) => {
  // Timing is a request per shop, so it is only worth making for a card the
  // customer actually sees. Once fetched it stays cached, and the card keeps
  // showing it after scrolling away and back.
  const isVisible = useHasBeenVisible(restaurant['@id']);
  const { data: timing } = useGetRestaurantTimingQuery(restaurant['@id'], {
    skip: !isVisible || Boolean(restaurant.timing),
  });

  const shop = timing ? { ...restaurant, timing } : restaurant;

  // Until the timing is known, a shop is neither open nor closed; showing the
  // "unavailable" overlay before then would make every card flash shut.
  const isAvailable =
    !hasShippingTime(shop) || isRestaurantOrderingAvailable(shop);

  return (
    <Box className="bg-background-50" style={[styles.item, style]}>
      <View style={styles.images}>
        <RestaurantBanner src={restaurant.bannerImage ?? restaurant.image} />
        {restaurant.badges && (
          <View style={styles.badgesWrapper}>
            {restaurant.badges.map((badge, i) => (
              <RestaurantBadge type={badge} key={i} />
            ))}
          </View>
        )}
        {!isAvailable ? <RestaurantNotAvailableBannerOverlay /> : null}
        <Box className="bg-background-50" style={ styles.logoWrapper }>
          <Image
            style={styles.logo}
            resizeMode="cover"
            source={{ uri: restaurant.image }}
          />
        </Box>
      </View>
      <View style={styles.content}>
        <View style={styles.nameWrapper}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {restaurant.name}
          </Text>
        </View>
        <View>
          <TimingBadge restaurant={shop} />
        </View>
        <View style={styles.details}>
          {restaurant.tags?.length > 0 ? (
            restaurant.tags.map((tag, i) => (
              <RestaurantTag key={i} text={tag} />
            ))
          ) : restaurant.description ? (
            <OneLineText style={styles.detailsText}>
              {restaurant.description}
            </OneLineText>
          ) : restaurant.address ? (
            <OneLineText style={styles.detailsText}>
              {restaurant.address.streetAddress}
            </OneLineText>
          ) : (
            <Text style={styles.detailsText}>No description</Text>
          )}
        </View>
      </View>
    </Box>
  );
};
