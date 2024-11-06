import React, { useMemo } from 'react';
import { IconMapPin } from '@tabler/icons-react-native';
import i18next from 'i18next';
import { Button, Image, Text } from 'native-base';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RestaurantBadge } from '../../../components/RestaurantBadge';
import { RestaurantTag } from '../../../components/RestaurantTag';
import {
  useBackgroundContainerColor,
  useBaseTextColor,
  useSecondaryTextColor,
} from '../../../styles/theme';
import { TimingBadge } from './RestaurantBadges';
import DangerAlert from '../../../components/DangerAlert';
import i18n from '../../../i18n';
import moment from 'moment/moment';
import {
  isRestaurantAvailable,
  isRestaurantOpeningSoon,
  shouldShowPreOrder,
} from '../../../utils/checkout';
import { RestaurantBanner } from '../../../components/RestaurantBanner';
import {
  PreOrderBannerOverlay,
  RestaurantNotAvailableBannerOverlay,
} from '../../../components/RestaurantBannerOverlay';

const styles = StyleSheet.create({
  profile: {},
  content: {
    padding: 16,
    display: 'flex',
    gap: 8,
  },
  detailsWrapper: {
    marginTop: -74, // logoWrapper height * 64%
    marginBottom: -12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 16,
  },
  logoWrapper: {
    flexShrink: 0,
    padding: 8,
    width: 116,
    height: 116,
    borderRadius: 16,
  },
  logoWrapperShadow: {
    elevation: 8,
    shadowColor: '#00000044',
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { height: 8, width: 0 },
  },
  description: {
    marginTop: 8,
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  logo: {
    borderRadius: 8,
    aspectRatio: '1',
    width: '100%',
  },
  badgesScroll: {
    width: '100%',
    overflow: 'hidden',
  },
  badgesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    left: 0,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  address: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    // alignSelf: "center",
    textAlignVertical: 'center',
    gap: 4,
  },
});

function OpeningHoursWarning({
  currentTimeSlot,
  isAvailable,
  isOpeningSoon,
  showPreOrder,
}) {
  if (showPreOrder) {
    return (
      <DangerAlert
        adjustsFontSizeToFit={true}
        text={`${i18n.t('RESTAURANT_CLOSED_BUT_OPENS', {
          datetime: moment(currentTimeSlot.timeSlot[0])
            .calendar(moment(), {
              sameElse: 'llll',
            })
            .replace(/\s/g, '\u00A0'),
        })}`}
      />
    );
  }

  if (!isAvailable && isOpeningSoon) {
    return (
      <DangerAlert
        text={`${i18n.t('RESTAURANT_CLOSED_AND_NOT_AVAILABLE', {
          datetime: moment(currentTimeSlot.timeSlot[0])
            .calendar(moment(), {
              sameElse: 'llll',
            })
            .replace(/\s/g, '\u00A0'),
        })}`}
      />
    );
  }

  // when restaurant is not available
  // it will be shown on the banner and in the 'timing' section
  return null;
}

function BannerOverlay({ isAvailable, showPreOrder }) {
  if (!isAvailable) {
    return <RestaurantNotAvailableBannerOverlay />;
  }

  if (showPreOrder) {
    return <PreOrderBannerOverlay />;
  }

  return null;
}

function RestaurantProfile({ restaurant, openingHoursSpecification, onInfo }) {
  const backgroundColor = useBackgroundContainerColor();
  const stroke = useBaseTextColor();
  const textSecondary = useSecondaryTextColor();

  const currentTimeSlot = useMemo(
    () => openingHoursSpecification.currentTimeSlot,
    [openingHoursSpecification],
  );

  const isAvailable = useMemo(
    () => isRestaurantAvailable(restaurant),
    [restaurant],
  );
  const isOpeningSoon = useMemo(
    () => isRestaurantOpeningSoon(restaurant),
    [restaurant],
  );
  const showPreOrder = useMemo(
    () => shouldShowPreOrder(restaurant),
    [restaurant],
  );

  return (
    <View style={([styles.profile], { backgroundColor })}>
      <RestaurantBanner src={restaurant.bannerImage ?? restaurant.image} />
      <BannerOverlay isAvailable={isAvailable} showPreOrder={showPreOrder} />
      <View style={styles.detailsWrapper}>
        <View style={[styles.logoWrapper, { backgroundColor }]}>
          <View style={styles.logoWrapperShadow}>
            <Image
              style={styles.logo}
              resizeMode="cover"
              source={{ uri: restaurant.image }}
              alt="logo"
            />
          </View>
        </View>
        {restaurant?.badges?.length >= 1 ? (
          <ScrollView
            style={styles.badgesScroll}
            horizontal={true}
            showsHorizontalScrollIndicator={true}>
            <View style={styles.badgesWrapper}>
              {restaurant.badges.map((badge, i) => (
                <RestaurantBadge type={badge} key={i} />
              ))}
            </View>
          </ScrollView>
        ) : null}
      </View>
      <View style={styles.content}>
        <OpeningHoursWarning
          currentTimeSlot={currentTimeSlot}
          isAvailable={isAvailable}
          isOpeningSoon={isOpeningSoon}
          showPreOrder={showPreOrder}
        />
        <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <TimingBadge restaurant={restaurant} />
          <Button size="sm" variant="link" onPress={onInfo}>
            {i18next.t('RESTAURANT_MORE_INFOS')}
          </Button>
        </View>
        <View style={styles.address}>
          <IconMapPin size={20} stroke={stroke} strokeWidth={1.5} />
          <Text>{restaurant.address.streetAddress}</Text>
        </View>
        {restaurant.description ? (
          <View style={styles.description}>
            <Text style={{ color: textSecondary }}>
              {restaurant.description}
            </Text>
          </View>
        ) : null}
        {restaurant.tags?.length > 0 ? (
          <View style={styles.tags}>
            {restaurant.tags.map((tag, i) => (
              <RestaurantTag key={i} text={tag} />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default RestaurantProfile;
