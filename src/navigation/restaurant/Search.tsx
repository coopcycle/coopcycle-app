import React, { useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { selectOrders } from '../../redux/Restaurant/selectors';
import OrderListItem from './components/OrderListItem';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';

export default function Search() {
  const orders = useSelector(selectOrders);

  const navigation = useNavigation();
  const { t } = useTranslation();

  const textInput = useRef(null);

  const [query, setQuery] = useState(null);

  const filteredOrders = useMemo(() => {
    if (!query) {
      return [];
    }

    return orders.filter(order => {
      return order.number.toLowerCase().includes(query.toLowerCase());
    });
  }, [orders, query]);

  return (
    <BasicSafeAreaView>
      <FormControl>
        <Input className="m-4 p-2">
          <InputField
            size="md"
            ref={textInput}
            keyboardType="web-search"
            blurOnSubmit={true}
            autoCorrect={false}
            onChangeText={_.debounce(setQuery, 350)}
            placeholder={t('RESTAURANT_SEARCH_ORDERS_INPUT_PLACEHOLDER')}
          />
          <InputSlot className="pr-3" onPress={() => {
            setQuery(null);
            textInput.current.clear();
            textInput.current.blur();
          }}>
            <InputIcon as={CloseIcon} />
          </InputSlot>
        </Input>
      </FormControl>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => item['@id']}
        renderItem={({ item }) => (
          <OrderListItem
            order={item}
            onItemClick={order =>
              navigation.navigate('RestaurantOrder', { order })
            }
          />
        )}
      />
    </BasicSafeAreaView>
  );
}
