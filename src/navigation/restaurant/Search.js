import React, { useMemo, useRef, useState } from 'react'
import _ from 'lodash'
import { FormControl, IconButton, Input } from 'native-base'
import { FlatList } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useSelector } from 'react-redux'
import { selectOrders } from '../../redux/Restaurant/selectors'
import OrderListItem from './components/OrderListItem'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import BasicSafeAreaView from '../../components/BasicSafeAreaView'

export default function Search() {
  const orders = useSelector(selectOrders)

  const navigation = useNavigation()
  const { t } = useTranslation()

  const textInput = useRef(null)

  const [ query, setQuery ] = useState(null)

  const filteredOrders = useMemo(() => {
    if (!query) {
      return []
    }

    return orders.filter(order => {
      return order.number.toLowerCase().includes(query.toLowerCase())
    })
  }, [ orders, query ])

  return (
    <BasicSafeAreaView>
      <FormControl>
        <Input
          size="md"
          m={ 4 }
          p={ 2 }
          ref={ textInput }
          keyboardType="web-search"
          blurOnSubmit={ true }
          autoCorrect={ false }
          InputRightElement={
            <IconButton
              _icon={ { as: FontAwesome5, name: 'times' } }
              onPress={ () => {
                setQuery(null)
                textInput.current.clear()
                textInput.current.blur()
              } }
            />
          }
          onChangeText={ _.debounce(setQuery, 350) }
          placeholder={ t('RESTAURANT_SEARCH_ORDERS_INPUT_PLACEHOLDER') }
        />
      </FormControl>
      <FlatList
        data={ filteredOrders }
        keyExtractor={ (item, index) => item['@id'] }
        renderItem={ ({ item }) => (
          <OrderListItem
            order={ item }
            onItemClick={ order =>
              navigation.navigate('RestaurantOrder', { order })
            }
          />
        ) }
      />
    </BasicSafeAreaView>
  )
}
