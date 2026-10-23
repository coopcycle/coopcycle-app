import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useSelector } from 'react-redux';

import RestaurantSearch from '../../../components/RestaurantSearch';

type Props = {
  children: React.ReactNode;
  testID?: string;
};

/**
 * The chrome shared by the two screens that list shops: the address bar
 * pinned at the top, with the screen's content below it.
 *
 * The address decides which shops are listed, so it is reachable from either
 * screen. The bar is positioned absolutely, hence the padding that reserves
 * room for it and the fact that it is rendered last, above the content.
 */
export default function ShopsScreenLayout({ children, testID }: Props) {
  const [width, setWidth] = useState(Dimensions.get('window').width);

  const address = useSelector((state: any) => state.checkout.address);
  const addressAsText = address ? address.streetAddress : '';

  return (
    <View
      style={{ flex: 1, paddingTop: 70 }}
      testID={testID}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <View style={{ flexGrow: 1 }}>{children}</View>
      {/* Rendered last so it sits above the list. The key makes sure it
          re-renders once a new address has been picked. */}
      <RestaurantSearch
        defaultValue={address}
        width={width}
        key={addressAsText}
      />
    </View>
  );
}
