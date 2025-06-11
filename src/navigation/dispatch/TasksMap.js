import { Text, View } from 'native-base';
import { useSelector } from 'react-redux';

import { mediumGreyColor } from '../../styles/common';
import { selectSelectedDate } from '../../shared/logistics/redux';
import AddButton from './components/AddButton';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";

export default function TasksMap({
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
