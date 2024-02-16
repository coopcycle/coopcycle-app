import {Image, Text, useColorModeValue} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {RestaurantBadge} from '../../../components/RestaurantBadge';
import AddressIcon from './AddressIcon';
import {TimingBadge} from './RestaurantBadges';

const styles = StyleSheet.create({
  profile: {},
  content: {
    padding: 16,
    display: 'flex',
    gap: 8,
  },
  restaurantName: {
    color: '#ffffff',
    fontFamily: 'Raleway-Regular',
    fontWeight: 'bold',
    fontSize: 18,
  },
  detailsWrapper: {
    marginTop: -64,
    marginBottom: -12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    paddingLeft: 16,
    // backgroundColor: '#fff0004F',
    // width: '100%',
  },
  logoWrapper: {
    flexShrink: 0,
    padding: 12,
    backgroundColor: '#fff',
    width: 116,
    height: 116,
    borderRadius: 16,
  },
  logo: {
    borderRadius: 8,
    aspectRatio: '1',
    width: '100%',
  },
  banner: {
    aspectRatio: '16/9',
    width: '100%',
  },
  badgesScroll: {
    width: '100%',
  },
  badgesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    left: 0,
    marginTop: 4,
    marginBottom: 12,
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

function RestaurantProfile({restaurant, onInfo}) {
  const backgroundColor = useColorModeValue('#fff', '#000');
  const stroke = useColorModeValue('#000', '#fff');

  return (
    <View style={([styles.profile], {backgroundColor})}>
      <Image
        style={styles.banner}
        resizeMode="cover"
        source={{uri: restaurant.bannerImage}}
        alt="Banner"
      />
      <View style={styles.detailsWrapper}>
        <View style={styles.logoWrapper}>
          <Image
            style={styles.logo}
            resizeMode="cover"
            source={{uri: restaurant.image}}
            alt="logo"
          />
        </View>
        {restaurant.badges.length >= 1 ? (
          <ScrollView
            style={styles.badgesScroll}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.badgesWrapper}>
              {restaurant.badges.map((badge, i) => (
                <RestaurantBadge type={badge} key={i} />
              ))}
            </View>
          </ScrollView>
        ) : null}
      </View>
      <View style={styles.content}>
        <TimingBadge restaurant={restaurant} />
        <View style={styles.address}>
          <AddressIcon stroke={stroke} />
          <Text>{restaurant.address.streetAddress}</Text>
        </View>

        {restaurant.description ? <Text>{restaurant.description}</Text> : null}
      </View>
    </View>
  );
}

export default RestaurantProfile;
