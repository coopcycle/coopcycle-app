import {Image, StyleSheet, View} from 'react-native';
import {Text, useColorModeValue} from 'native-base';
import {TimingBadge} from '../navigation/checkout/components/RestaurantBadges';
import {RestaurantBadge} from './RestaurantBadge';
import {RestaurantTag} from './RestaurantTag';
import React from 'react';
import {getRestaurantIsAvailable} from '../utils/checkout';
import i18n from '../i18n';
import Svg, {Path} from 'react-native-svg';

const logoSize = 64;

const OneLineText = props => (
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
    // backgroundColor: backgroundColor,
  },
  images: {
    width: '100%',
  },
  banner: {
    aspectRatio: '16/9',
    width: '100%',
    marginBottom: -50,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '16/9',
    color: 'white',
  },
  closedLabel: {
    fontWeight: 500,
    fontSize: 16,
    color: 'white',
  },
  closedIcon: {
    height: 32,
    width: 32,
    stroke: "white"
  },
  logoWrapper: {
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
  name: {
    fontWeight: '600',
    fontSize: 18,
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

export const RestaurantCard = ({restaurant}) => {
  // const backgroundColor = useColorModeValue('white', '#121212');
  // const backgroundColor = useColorModeValue('white', '#222222');
  const backgroundColor = useColorModeValue('white', '#1a1a1a');
  const isClosed = getRestaurantIsAvailable(restaurant);
  const overlayBackgroundColor = useColorModeValue(
    'rgba(0,0,0,0.5)',
    'rgba(0,0,0,0.75)',
  );
  //   const backgroundColor = useColorModeValue('white', '#FFFFFF16');

  return (
    <View style={[styles.item, {backgroundColor}]}>
      <View style={styles.images}>
        <View styles={styles.bannerWrapper}>
          <Image
            style={styles.banner}
            resizeMode="cover"
            source={{uri: restaurant.bannerImage || restaurant.image}}
          />
        </View>
        {restaurant.badges && (
          <View style={styles.badgesWrapper}>
            {restaurant.badges.map((badge, i) => (
              <RestaurantBadge type={badge} key={i} />
            ))}
          </View>
        )}
        {isClosed ? (
          <View
            style={[styles.overlay, {backgroundColor: overlayBackgroundColor}]}>
            <Svg
              style={[styles.closedIcon]}
              xmlns="http://www.w3.org/2000/svg"
              // width={22}
              // height={22}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
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
            <Text style={styles.closedLabel} numberOfLines={1}>
              {i18n.t('NOT_AVAILABLE_ATM')}
            </Text>
          </View>
        ) : null }
        <View style={[styles.logoWrapper, {backgroundColor}]}>
          <Image
            style={styles.logo}
            resizeMode="cover"
            source={{uri: restaurant.image}}
          />
        </View>
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{restaurant.name}</Text>
        </View>
        <View>
          <TimingBadge restaurant={restaurant} />
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
    </View>
  );
};
