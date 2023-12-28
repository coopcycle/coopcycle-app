import {Image, StyleSheet, View} from 'react-native';
import {Text, useColorModeValue} from 'native-base';
import {TimingBadge} from '../navigation/checkout/components/RestaurantBadges';
import {RestaurantBadge} from './RestaurantBadge';
import {RestaurantTag} from './RestaurantTag';
import React from 'react';

const logoSize = 64;

const OneLineText = props => (
  <Text
    numberOfLines={props.numberOfLines || 1}
    ellipsizeMode="tail"
    {...props}>
    {props.children}
  </Text>
);

export const RestaurantCard = ({restaurant}) => {
  const backgroundColor = useColorModeValue('white', '#121212');
  //   const backgroundColor = useColorModeValue('white', '#FFFFFF16');

  const styles = StyleSheet.create({
    item: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 0,
      backgroundColor: backgroundColor,
    },
    images: {
      width: '100%',
    },
    banner: {
      aspectRatio: '16/9',
      width: '100%',
      marginBottom: -50,
    },
    logoWrapper: {
      // backgroundColor: '#fff',
      backgroundColor: backgroundColor,
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
      gap: 8,
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
      overflow: "hidden",
      whiteSpace: 'nowrap',
      display: 'flex',
      flexDirection: "row",
      gap: 4
    },
    detailsText: {
      fontSize: 14,
      opacity: 0.75,
    },
  });

  return (
    <View style={styles.item}>
      <View style={styles.images}>
        <View styles={styles.bannerWrapper}>
          <Image
            style={styles.banner}
            resizeMode="cover"
            source={{uri: restaurant.bannerImage || restaurant.image }}
          />
        </View>
        <View style={styles.logoWrapper}>
          <Image
            style={styles.logo}
            resizeMode="cover"
            source={{uri: restaurant.image}}
          />
        </View>
        { restaurant.badges &&
        <View style={styles.badgesWrapper}>
          {restaurant.badges.map((badge, i) => (
            <RestaurantBadge type={badge} key={i} />
          ))}
        </View>
        }
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{restaurant.name}</Text>
        </View>
        <View>
          <TimingBadge restaurant={restaurant} />
        </View>
        <View style={styles.details}>
          { restaurant.tags?.length > 0 ? (
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
