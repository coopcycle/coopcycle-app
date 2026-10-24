import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useAppSelector } from '../../redux/store';

import RestaurantList from '../../components/RestaurantList';
import RestaurantSearch from '../../components/RestaurantSearch';
import { setRestaurant } from '../../redux/Checkout/actions';
import { selectRestaurants } from '../../redux/Checkout/selectors';

type Props = {
  navigation: { navigate: (route: string, params?: object) => void };
};

/**
 * Every shop that delivers to the current address, as a plain list, under the
 * address bar that picks that address.
 *
 * The shops are loaded by the checkout tab navigator, since the search modal
 * needs them too.
 */
export default function RestaurantsListPage({ navigation }: Props) {
  const dispatch = useDispatch();
  const [width, setWidth] = useState(Dimensions.get('window').width);

  const restaurants = useSelector(selectRestaurants);
  const address = useAppSelector(state => state.checkout.address);
  const isFetching = useAppSelector(
    state => state.checkout.isFetching || state.app.loading,
  );

  const addressAsText = address ? address.streetAddress : '';

  return (
    <View
      style={{ flex: 1, paddingTop: 70 }}
      testID="checkoutRestaurants"
      onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <View style={{ flexGrow: 1 }}>
        <RestaurantList
          restaurants={restaurants}
          addressAsText={addressAsText}
          isFetching={isFetching}
          onItemClick={restaurant => {
            dispatch(setRestaurant(restaurant['@id']));
            navigation.navigate('CheckoutRestaurant', { restaurant });
          }}
        />
      </View>
      {/* The address bar is positioned absolutely, hence the padding above
          that reserves room for it, and the fact that it is rendered last so
          that it sits above the list. The key makes sure it re-renders once a
          new address has been picked. */}
      <RestaurantSearch
        defaultValue={address}
        width={width}
        key={addressAsText}
      />
    </View>
  );
}
