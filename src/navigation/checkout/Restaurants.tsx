import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useAppSelector } from '../../redux/store';

import CuisineFilter, {
  availableCuisines,
  filterByCuisine,
} from '../../components/CuisineFilter';
import RestaurantList from '../../components/RestaurantList';
import RestaurantSearch from '../../components/RestaurantSearch';
import { setRestaurant } from '../../redux/Checkout/actions';
import { useGetShopCuisinesQuery } from '../../redux/api/slice';
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

  const { data: allCuisines, isLoading: isLoadingCuisines } =
    useGetShopCuisinesQuery();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  // Only the cuisines these shops actually serve, so that no icon in the
  // strip can lead to an empty list.
  const cuisines = useMemo(
    () => availableCuisines(allCuisines ?? [], restaurants),
    [allCuisines, restaurants],
  );

  const toggleCuisine = useCallback((value: string) => {
    setSelectedCuisines(previous =>
      previous.includes(value)
        ? previous.filter(cuisine => cuisine !== value)
        : [...previous, value],
    );
  }, []);

  // A cuisine the address no longer offers would otherwise keep filtering
  // invisibly once the customer moves to another address.
  const selected = useMemo(
    () =>
      selectedCuisines.filter(value =>
        cuisines.some(cuisine => cuisine.value === value),
      ),
    [cuisines, selectedCuisines],
  );

  const shown = useMemo(
    () => filterByCuisine(restaurants, selected),
    [restaurants, selected],
  );

  return (
    <View
      style={{ flex: 1, paddingTop: 70 }}
      testID="checkoutRestaurants"
      onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <View style={{ flexGrow: 1 }}>
        <RestaurantList
          restaurants={shown}
          addressAsText={addressAsText}
          isFetching={isFetching}
          ListHeaderComponent={
            <CuisineFilter
              cuisines={cuisines}
              selected={selected}
              onToggle={toggleCuisine}
              // The strip is narrowed against the shops, so it is only
              // settled once they are in too; outlining it until then is
              // what keeps it from appearing after the first cards.
              isLoading={isLoadingCuisines || isFetching}
            />
          }
          onItemClick={restaurant => {
            dispatch(setRestaurant(restaurant));
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
