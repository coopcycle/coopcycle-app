import {Text} from 'native-base';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
});

const RestaurantMenuItem = ({item, onPress, isLoading}) => {
  const enabled = item.hasOwnProperty('enabled') ? item.enabled : true;

  return (
    //   <TouchableOpacity
    //     style={styles.menuItem}
    //     onPress={enabled ? () => onPress(item) : null}
    //     testID={`menuItem:${item.sectionIndex}:${item.index}`}>
    //     <Text style={styles.menuItemText}>{item.name}</Text>
    //     {isLoading && <ActivityIndicator color="#c7c7c7" size="small" />}
    //   </TouchableOpacity>
    <Text>item</Text>
  );
};

export default RestaurantMenuItem;
