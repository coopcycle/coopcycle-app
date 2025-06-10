import { Text, View } from 'native-base';

import { mediumGreyColor } from '../../styles/common';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";

export default function TasksSearchResults({
  route,
}) {
  return (
    <BasicSafeAreaView>
      <View style={{ backgroundColor: mediumGreyColor }}>
        <Text>Search Results for: {route.params.searchQuery}</Text>
      </View>
    </BasicSafeAreaView>
  )
}
