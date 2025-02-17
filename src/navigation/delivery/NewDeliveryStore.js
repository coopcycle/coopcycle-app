
import { Box } from 'native-base'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'
import { connect, useSelector } from 'react-redux'
import KeyboardAdjustView from '../../components/KeyboardAdjustView'
import StoreListInput from '../dispatch/components/StoreListInput'
import FormInput from './components/FormInput'
import { loadAddresses, setStore } from '../../redux/Delivery/actions'
import { useDispatch } from 'react-redux'

const NewDeliveryStore = (props) => {
  const {
    t,
    navigation,
  } = props;
  const dispatch = useDispatch();
  const stores = useSelector(state => state.dispatch.stores);
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredStores, setFilteredStores] = useState(stores)

  const onSelectStore = (store) => {
    console.log('onSelectStore', JSON.stringify(store));
    dispatch(setStore(store))
    dispatch(loadAddresses(store))
    navigation.navigate('NewDeliveryPickup')
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
        <StoreListInput
          stores={filteredStores}
          onSelectStore={onSelectStore}
        />
      </SafeAreaView>
    </KeyboardAdjustView>
    )
  }

export default connect()(withTranslation()(NewDeliveryStore))
