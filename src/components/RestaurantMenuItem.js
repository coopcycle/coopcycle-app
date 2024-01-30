import {Text} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 500,
  },
  menuItemText: {
    fontSize: 16,
  },
});

const RestaurantMenuItem = ({item, onPress, isLoading}) => {
  const enabled = item.hasOwnProperty('enabled') ? item.enabled : true;

  return (
    // <TouchableOpacity
    //   style={styles.menuItem}
    //   onPress={enabled ? () => onPress(item) : null}
    //   testID={`menuItem:${item.sectionIndex}:${item.index}`}>
    //   <Text style={styles.menuItemText}>{item.name}</Text>
    //   {isLoading && <ActivityIndicator color="#c7c7c7" size="small" />}
    // </TouchableOpacity>
    <Text>item</Text>
  );
};

export default RestaurantMenuItem;
