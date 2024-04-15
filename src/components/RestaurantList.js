import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Center, HStack, Icon, Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getRestaurantCaption, shouldShowPreOrder } from '../utils/checkout';
import { RestaurantCard } from './RestaurantCard';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e7e7e7',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  restaurantNameText: {
    marginBottom: 5,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    color: '#ffffff',
    fontFamily: 'Raleway-Regular',
    fontWeight: 'bold',
  },
  closedLabel: {
    color: '#ffffff',
  },
});

const OneLineText = props => (
  <Text
    numberOfLines={props.numberOfLines || 1}
    ellipsizeMode="tail"
    {...props}>
    {props.children}
  </Text>
);

class RestaurantList extends Component {
  constructor(props) {
    super(props);
    this._renderEmptyState = this._renderEmptyState.bind(this);
  }

  renderItem(restaurant, index) {
    const showPreOrder = shouldShowPreOrder(restaurant);

    return (
      <TouchableOpacity
        onPress={() => this.props.onItemClick(restaurant)}
        testID={restaurant.testID}>
        <RestaurantCard restaurant={restaurant} />
      </TouchableOpacity>
    );
  }

  _renderEmptyState() {
    const { addressAsText, isFetching } = this.props;

    if (isFetching) {
      return null;
    }

    if (addressAsText) {
      return (
        <Center flex={1} justifyContent="center" alignItems="center" px="2">
          <Image
            style={{
              maxWidth: '40%',
              maxHeight: '30%',
              marginVertical: '5%',
              margin: 'auto',
            }}
            source={require('../assets/images/no_addresses.png')}
            resizeMode={'contain'}
          />
          <Text note style={{ textAlign: 'center' }}>
            {this.props.t('NO_RESTAURANTS')}
          </Text>
        </Center>
      );
    }

    //FIXME: This code is maybe unreachable
    return (
      <Center
        flex={1}
        justifyContent="center"
        alignItems="center"
        testID="checkoutSearchContent">
        <Icon as={Ionicons} name="search" style={{ color: '#cccccc' }} />
        <Text note>{this.props.t('ENTER_ADDRESS')}</Text>
      </Center>
    );
  }

  render() {
    let matchingCounter = 0;
    const restaurantsWithTestIDs = this.props.restaurants.map(
      (restaurant, index) => {
        let testID = `restaurants:${index}`;
        if (
          restaurant.address.streetAddress.match(/75020/g) ||
          restaurant.address.streetAddress.match(/75010/g) ||
          restaurant.address.streetAddress.match(/75019/g)
        ) {
          testID = `restaurantMatches:${matchingCounter}`;
          matchingCounter += 1;
        }

        return {
          ...restaurant,
          testID,
        };
      },
    );

    return (
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        testID="restaurantList"
        data={restaurantsWithTestIDs}
        keyExtractor={(item, index) => item['@id']}
        renderItem={({ item, index }) => this.renderItem(item, index)}
        ListEmptyComponent={this._renderEmptyState}
      />
    );
  }
}

export default withTranslation()(RestaurantList);
