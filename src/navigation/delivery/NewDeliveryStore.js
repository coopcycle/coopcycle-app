
import { Box } from 'native-base'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native'
import { withTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'

import { loadAddresses, setStore } from '../../redux/Delivery/actions'
import { useDispatch } from 'react-redux'
import { useFetchAllRecords } from '../../hooks/useFetchAllRecords'
import FormInput from './components/FormInput'
import KeyboardAdjustView from '../../components/KeyboardAdjustView'
import StoreListSelect from './components/StoreListSelect'
import { loadStoresRequest } from '../../redux/Dispatch/actions'


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
  } = useFetchAllRecords('/api/stores', 100);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setFilteredStores(stores);
  }, [stores])

  useEffect(() => {
    setFilteredStores(stores)
    console.log('Stores updated')
  }, [stores])

  const onRefreshStores = async () => {
    setIsRefreshing(true)
    try {
      await dispatch(loadStoresRequest())
      console.log('Stores after refresh') // Add logging to check updates
    } catch (error) {
      console.log('Error refreshing stores', error)
    }
    setIsRefreshing(false)
  }


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

    setFilteredStores(filtered);
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
        <StoreListSelect
          stores={filteredStores}
          onSelectStore={onSelectStore}
          isRefreshing={isRefreshing}
          onRefreshStores={onRefreshStores}
        />
      </SafeAreaView>
    </KeyboardAdjustView>
    )
  }

export default connect()(withTranslation()(NewDeliveryStore))
