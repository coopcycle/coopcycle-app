import { useEffect } from 'react';

import {
  searchRestaurants,
  searchRestaurantsForAddress,
} from '../../redux/Checkout/actions';
import { useAppDispatch, useAppSelector } from '../../redux/store';

/**
 * Loads the shops that deliver to the customer's address into
 * `state.checkout`, once, when the checkout tabs mount.
 *
 * It lives here rather than on the restaurants list screen because the search
 * modal filters its results against the same shops, and can be opened from
 * the home screen without the list ever having been visited. Picking another
 * address reloads them from the address screen, so this only covers start-up.
 */
export default function useLoadShops() {
  const dispatch = useAppDispatch();
  const address = useAppSelector(state => state.checkout.address);

  useEffect(() => {
    if (address) {
      dispatch(searchRestaurantsForAddress(address));
    } else {
      dispatch(searchRestaurants());
    }
    // Deliberately start-up only: `address` is read for the initial value,
    // but a later change to it is handled where the address is picked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
