import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import ItemSeparator from '../../components/ItemSeparator';
import { loadAddresses } from '../../redux/Account/actions';
import {
  searchRestaurantsForAddress,
  setAddress,
} from '../../redux/Checkout/actions';
import { selectAddresses } from '../../redux/Checkout/selectors';
import Address from '../../utils/Address';
import classNames from 'classnames'

function EmptyAddressList() {
  const { t } = useTranslation();
  return (
    <View style={{ alignItems: 'center', padding: 10 }}>
      <Image
        style={{
          maxWidth: '40%',
          maxHeight: '30%',
          marginVertical: '5%',
          margin: 'auto',
        }}
        source={require('../../assets/images/no_addresses.png')}
        resizeMode={'contain'}
      />
      <Heading>Hey oh !</Heading>
      <Text>{t('EMPTY_HERE')}</Text>
    </View>
  );
}

function AddressRow({ item, selectedAddress }) {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  function handlePress() {
    if (route.params?.action) {
      const addressPrecise = { ...item, isPrecise: true };
      switch (route.params.action) {
        case 'search':
          dispatch(searchRestaurantsForAddress(addressPrecise));
          break;
        case 'cart':
          dispatch(setAddress(addressPrecise, route.params.cart));
          break;
        default:
          dispatch(setAddress(addressPrecise));
      }
      navigation.goBack();
    } else {
      navigation.navigate('AddressDetails', { address: item });
    }
  }

  const isSameAddress = Address.isSameGeo(selectedAddress, item)

  return (
    <TouchableOpacity onPress={handlePress}>
      <HStack
        className={ classNames("px-2 py-3 justify-between", { 'bg-info-200': isSameAddress }) }>
        <Text>{item.streetAddress}</Text>
        <Text>{item.name}</Text>
      </HStack>
    </TouchableOpacity>
  );
}

export default function AccountAddressesPage() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [focused, setFocused] = useState(false);

  const addresses = useSelector(selectAddresses);
  const address = useSelector(state => {
    switch (route.params?.action) {
      case 'cart':
        return route.params?.cart.shippingAddress || {};
      default:
        return state.checkout.address;
    }
  });

  const textInputContainerHeight = 54;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AddressAutocomplete
          containerStyle={{
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
          inputContainerStyle={{
            height: textInputContainerHeight,
          }}
          style={{
            height: textInputContainerHeight * 0.7,
          }}
          placeholder={t('ENTER_NEW_ADDRESS')}
          onChangeText={text => setFocused(text.length >= 3)}
          onSelectAddress={addr => {
            navigation.navigate('AddressDetails', { address: addr });
          }}
          onBlur={() => setFocused(false)}
        />
      </View>
      {!focused && (
        <View style={{ flex: 4 }}>
          <Divider />
          <Heading className="my-3 px-2">{t('MY_ADDRESSES')}</Heading>
          <FlatList
            keyExtractor={(item, index) => `address-${index}`}
            data={addresses}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await dispatch(loadAddresses());
              setRefreshing(false);
            }}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={EmptyAddressList}
            renderItem={({ item }) => (
              <AddressRow item={item} selectedAddress={address} />
            )}
          />
        </View>
      )}
    </View>
  );
}
