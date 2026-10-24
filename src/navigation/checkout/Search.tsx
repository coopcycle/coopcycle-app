import React from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import ShopCollections from '../../components/ShopCollections';
import { setRestaurant } from '../../redux/Checkout/actions';

type Props = {
  navigation: { navigate: (route: string, params?: object) => void };
};

/**
 * The home screen: the collections of the custom homepage.
 *
 * Unlike the restaurants list, it shows every shop the instance has — the
 * collections are meant to give an overview of what is on offer, not of what
 * happens to deliver to the address the customer picked.
 */
export default function RestaurantsPage({ navigation }: Props) {
  const dispatch = useDispatch();

  return (
    <ScrollView testID="checkoutHome">
      <ShopCollections
        onItemClick={restaurant => {
          dispatch(setRestaurant(restaurant['@id']));
          navigation.navigate('CheckoutRestaurant', { restaurant });
        }}
      />
    </ScrollView>
  );
}
