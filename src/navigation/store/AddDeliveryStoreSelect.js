
import { Box } from 'native-base'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'
import { connect, useSelector } from 'react-redux'
import StoreListInput from '../dispatch/components/StoreListInput'
import FormInput from './components/FormInput'

const AddDeliveryStoreSelect = (props) => {
  const {
    t,
  } = props;
  const stores = useSelector(state => state.dispatch.stores);

  const onSelectStore = (store) => {
    // TODO: do something more interesting with selected store
    console.log(store)
  }

  return <SafeAreaView
        style={{
          flex: 1,
        }}>
          <Box p="5">
            <FormInput
              autoCorrect={false}
              returnKeyType="done"
              //onChangeText={handleChange('businessName')}
              //onBlur={handleBlur('businessName')}
              value=""
              placeholder={t('DISPATCH_NEW_DELIVERY_FILTER_STORE_PLACEHOLDER')}
            />
          </Box>
            <StoreListInput
              stores={stores}
              onSelectStore={onSelectStore}
            />
          </SafeAreaView>
  }

export default connect()(withTranslation()(AddDeliveryStoreSelect))
