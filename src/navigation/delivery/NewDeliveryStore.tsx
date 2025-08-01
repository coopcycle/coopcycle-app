import { ActivityIndicator, SafeAreaView } from 'react-native';
import { Box, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';

import {
  loadAddresses,
  setStore,
  setStores,
} from '../../redux/Delivery/actions';
import { selectStores } from '../../redux/Delivery/selectors';
import { sortByName } from '../../redux/util';
import FormInput from './components/FormInput';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import StoreListSelect from './components/StoreListSelect';
import { useGetStoresQuery } from '../../redux/api/slice';

const NewDeliveryStore = props => {
  const { navigation } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const stores = useSelector(selectStores);

  const {
    data: backendStores,
    isError,
    isLoading: isLoadingBackendStores,
    refetch,
  } = useGetStoresQuery();

  useEffect(() => {
    if (backendStores) {
      dispatch(setStores(backendStores));
    }
  }, [backendStores, dispatch]);

  useEffect(() => {
    setIsLoading(isLoadingBackendStores && (!stores || stores.length === 0));
  }, [isLoadingBackendStores, stores]);

  const onSelectStore = store => {
    dispatch(setStore(store));
    dispatch(loadAddresses(store));
    navigation.navigate('NewDeliveryPickupAddress');
  };

  const onRefreshStores = () => {
    setSearchQuery('');
    refetch();
  };

  // Filter store by name
  const normalizeString = str =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const filterStores = useCallback((query, _stores) => {
    const normalizedQuery = normalizeString(query);
    const filtered = _stores.filter(store =>
      normalizeString(store.name).includes(normalizedQuery),
    );

    // TODO: Is there a way to avoid calling "sortByName" here?
    // It would be nice to delegate it to the "useFetchAllStores" hook since it's already done in there..!
    setStoreList(sortByName(filtered));
  }, []);

  useEffect(() => {
    filterStores(searchQuery, stores);
  }, [filterStores, searchQuery, stores]);

  // TODO: We should do something about the "KeyboardAdjustView" solution..!
  return (
    <KeyboardAdjustView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        {isLoading && (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator animating={true} size="large" />
          </Box>
        )}
        {isError && (
          <Text style={{ textAlign: 'center' }}>{t('AN_ERROR_OCCURRED')}</Text>
        )}
        {!isLoading && !isError && (
          <>
            <Box p="5">
              <FormInput
                value={searchQuery}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                onChangeText={setSearchQuery}
                placeholder={t(
                  'DISPATCH_NEW_DELIVERY_FILTER_STORE_PLACEHOLDER',
                )}
              />
            </Box>
            <StoreListSelect
              stores={storeList}
              onSelectStore={onSelectStore}
              isRefreshing={isLoading}
              onRefreshStores={onRefreshStores}
            />
          </>
        )}
      </SafeAreaView>
    </KeyboardAdjustView>
  );
};

export default NewDeliveryStore;
