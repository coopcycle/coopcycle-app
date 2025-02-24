import { Box, Text } from 'native-base'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, SafeAreaView } from 'react-native'

import { useDispatch } from 'react-redux'
import KeyboardAdjustView from '../../components/KeyboardAdjustView'
import { useFetchAllStores } from '../../hooks/useFetchAllFunctions'
import { loadAddresses, setStore } from '../../redux/Delivery/actions'
import { sortByName } from '../../redux/util'
import FormInput from './components/FormInput'
import StoreListSelect from './components/StoreListSelect'


const NewDeliveryStore = (props) => {
  const {
    navigation,
  } = props;
  const { t } = useTranslation()
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [storeList, setStoreList] = useState([]);

  const {
    stores,
    error,
    isLoading,
    refreshStores,
  } = useFetchAllStores(setStoreList);

  const onSelectStore = (store) => {
    dispatch(setStore(store))
    dispatch(loadAddresses(store))
    navigation.navigate('NewDeliveryPickupAddress');
  }

  const onRefreshStores = () => {
    setSearchQuery("");
    refreshStores();
  }

  // Filter store by name
  const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleSearch = (query) => {
    setSearchQuery(query);
    const normalizedQuery = normalizeString(query);

    const filtered = (stores || []).filter(store =>
      normalizeString(store.name).includes(normalizedQuery)
    );

    // TODO: Is there a way to avoid calling "sortByName" here?
    // It would be nice to delegate it to the "useFetchAllStores" hook since it's already done in there..!
    setStoreList(sortByName(filtered));
  };

  // TODO: We should do something about the "KeyboardAdjustView" solution..!
  return (
    <KeyboardAdjustView style={{ flex: 1 }} androidBehavior={'padding'}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
      <Box p="5">
        <FormInput
          value={searchQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
          onChangeText={handleSearch}
          placeholder={t('DISPATCH_NEW_DELIVERY_FILTER_STORE_PLACEHOLDER')}
        />
      </Box>
      {isLoading &&  <ActivityIndicator animating={true} size="large" />}
      {error && <Text style={{ textAlign: 'center' }}>{t('AN_ERROR_OCCURRED')}</Text>}
      {!isLoading && !error &&
        <StoreListSelect
          stores={storeList}
          onSelectStore={onSelectStore}
          isRefreshing={isLoading}
          onRefreshStores={onRefreshStores}
        />
      }

      </SafeAreaView>
    </KeyboardAdjustView>
    )
  }

export default NewDeliveryStore
