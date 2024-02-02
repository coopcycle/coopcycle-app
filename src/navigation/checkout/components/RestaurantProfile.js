import {Image, Text, useColorModeValue} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
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
  banner: {
    aspectRatio: '16/9',
    width: '100%',
  },
  badgesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    left: 0,
    width: '100%',
    marginTop: 4,
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
      <View style={styles.content}>
        <TimingBadge restaurant={restaurant} />
        <View style={styles.address}>
          <AddressIcon stroke={stroke} />
          <Text>{restaurant.address.streetAddress}</Text>
        </View>
        {restaurant.badges >= 1 && (
          <View style={styles.badgesWrapper}>
            {restaurant.badges.map((badge, i) => (
              <RestaurantBadge type={badge} key={i} />
            ))}
          </View>
        )}
        {restaurant.description ? <Text>{restaurant.description}</Text> : null}
      </View>
    </View>
  );
}

export default RestaurantProfile;
