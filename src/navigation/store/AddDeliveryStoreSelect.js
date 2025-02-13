
import { Box } from 'native-base'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'
import { connect, useSelector } from 'react-redux'
import StoreListInput from '../dispatch/components/StoreListInput'
import FormInput from './components/FormInput'
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import _ from 'lodash'

const AddDeliveryStoreSelect = (props) => {
  const {
    t,
  } = props;
  const stores = useSelector(state => state.dispatch.stores);
  const [searchQuery, setSearchQuery] = useState('')
  const [storesList, setStoresList] = useState(stores)

  const onSelectStore = (store) => {
    console.log(store);
    // TODO: Assign the store to `state.store`
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    console.log('seachQuery', searchQuery)
    const formattedQuery = query.toLowerCase()
    const filterderStoresList = _.filter(storesList, (store) => {
      return contains(store, formattedQuery)
    })
    setStoresList(filterderStoresList)
  }

  const contains = ({ name }, query) => {
    if(name.includes(query)) {
      return true
    }
    return false
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

export default connect()(withTranslation()(AddDeliveryStoreSelect))
