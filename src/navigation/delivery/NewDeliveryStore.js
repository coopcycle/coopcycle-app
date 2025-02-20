import { Box, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { ActivityIndicator, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'

import { useDispatch } from 'react-redux'
import KeyboardAdjustView from '../../components/KeyboardAdjustView'
import { useFetchAllRecords } from '../../hooks/useFetchAllRecords'
import { loadAddresses, setStore } from '../../redux/Delivery/actions'
import FormInput from './components/FormInput'
import StoreListSelect from './components/StoreListSelect'
import { sortByName } from '../../redux/util'


const NewDeliveryStore = (props) => {
  const {
    t,
    navigation,
  } = props;
  const dispatch = useDispatch();

  const {
    data: stores,
    error,
    isLoading,
    refetch,
  } = useFetchAllRecords('/api/stores', 100);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);

  useEffect(() => {
    setFilteredStores(sortByName(stores));
  }, [stores])

  const onSelectStore = (store) => {
    dispatch(setStore(store))
    dispatch(loadAddresses(store))
    navigation.navigate('NewDeliveryPickupAddress');
  }

  // Filter store by name
  const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleSearch = (query) => {
    setSearchQuery(query);
    const normalizedQuery = normalizeString(query);

    const filtered = stores.filter(store =>
      normalizeString(store.name).includes(normalizedQuery)
    );

    setFilteredStores(sortByName(filtered));
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
          stores={filteredStores}
          onSelectStore={onSelectStore}
          isRefreshing={isLoading}
          onRefreshStores={refetch}
        />
      } 
        
      </SafeAreaView>
    </KeyboardAdjustView>
    )
  }

export default connect()(withTranslation()(NewDeliveryStore))