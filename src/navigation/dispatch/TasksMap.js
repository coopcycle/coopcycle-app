import { Text, View } from 'native-base';

import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import { mediumGreyColor } from '../../styles/common';
import AddButton from './components/AddButton';
import { useSelector } from 'react-redux';
import { selectSelectedDate } from '../../shared/logistics/redux';

export default function TaskMap({
  navigation,
}) {
  const selectedDate = useSelector(selectSelectedDate);

  return (
    <BasicSafeAreaView>
      <View style={{ backgroundColor: mediumGreyColor }}>
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={{ fontWeight: '700' }}>
            {selectedDate.format('ll')}
          </Text>
        </AddButton>
        <Text>This is a map</Text>
      </View>
    </BasicSafeAreaView>
  )
}