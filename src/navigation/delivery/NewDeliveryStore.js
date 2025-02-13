
import { Box } from 'native-base'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'
import { connect, useSelector } from 'react-redux'
import StoreListInput from '../dispatch/components/StoreListInput'
import FormInput from './components/FormInput'
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import _ from 'lodash'

const NewDeliveryStore = (props) => {
  const {
    t,
  } = props;
  const stores = useSelector(state => state.dispatch.stores);
  const [searchQuery, setSearchQuery] = useState('')
  const [storesList, setStoresList] = useState(stores)

  const onSelectStore = (store) => {
    console.log('onSelectStore', JSON.stringify(store));
    // TODO: Assign the store to `state.store`
  }

  const contains = (formattedStoreName, query) => formattedStoreName.includes(query)
  const handleSearch = (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase()
    const filterderStoresList = _.filter(stores, (store) => {
      const formattedStoreName = store.name.toLowerCase()
      return contains(formattedStoreName, formattedQuery)
    })
    setStoresList(filterderStoresList)
  }

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
          onChangeText={(query) => handleSearch(query)}
          placeholder={t('DISPATCH_NEW_DELIVERY_FILTER_STORE_PLACEHOLDER')}
          
        />
      </Box>
        <StoreListInput
          stores={storesList}
          onSelectStore={onSelectStore}
        />
      </SafeAreaView>
    </KeyboardAdjustView>
    )
  }

export default connect()(withTranslation()(NewDeliveryStore))
