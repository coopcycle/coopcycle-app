import { Text, View } from 'native-base';

import { mediumGreyColor } from '../../styles/common';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    backgroundColor: mediumGreyColor,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function TasksSearchResults({
  route,
}) {
  return (
    <BasicSafeAreaView>
      <View style={styles.view}>
        <Text style={styles.text}>Search results for '{route.params.searchQuery}' coming soon..!</Text>
      </View>
    </BasicSafeAreaView>
  )
}
