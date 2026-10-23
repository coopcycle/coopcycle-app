import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RestaurantList from '../../components/RestaurantList';
import { setRestaurant } from '../../redux/Checkout/actions';
import { selectRestaurants } from '../../redux/Checkout/selectors';
import ShopsScreenLayout from './components/ShopsScreenLayout';

type Props = {
  navigation: { navigate: (route: string, params?: object) => void };
};

/**
 * Every shop that delivers to the current address, as a plain list.
 *
 * The shops are loaded by the home screen, the tab navigator's initial route.
 */
export default function RestaurantsListPage({ navigation }: Props) {
  const dispatch = useDispatch();

  const restaurants = useSelector(selectRestaurants);
  const addressAsText = useSelector((state: any) =>
    state.checkout.address ? state.checkout.address.streetAddress : '',
  );
  const isFetching = useSelector(
    (state: any) => state.checkout.isFetching || state.app.loading,
  );

  return (
    <ShopsScreenLayout testID="checkoutRestaurants">
      <RestaurantList
        restaurants={restaurants}
        addressAsText={addressAsText}
        isFetching={isFetching}
        onItemClick={restaurant => {
          dispatch(setRestaurant(restaurant['@id']));
          navigation.navigate('CheckoutRestaurant', { restaurant });
        }}
      />
    </ShopsScreenLayout>
  );
}
