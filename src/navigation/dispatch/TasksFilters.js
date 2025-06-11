import { Text, View } from 'native-base';

import { mediumGreyColor } from '../../styles/common';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";

export default function TasksFilters({
  ...props
}) {

  return (
    <BasicSafeAreaView>
      <View style={{ backgroundColor: mediumGreyColor }}>
        <Text>Here are filters</Text>
      </View>
    </BasicSafeAreaView>
  )
}
