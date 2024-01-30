import {FlatList} from 'native-base';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  sectionMenu: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sectionMenuItem: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  sectionMenuItemText: {
    padding: 24,
    color: 'gray',
  },
  sectionMenuItemTextActive: {
    color: 'red',
  },
  sectionMenuItemActive: {
    borderBottomColor: 'red',
  },
});

const RestaurantMenuHeader = ({sections}) => {
  return (
    <FlatList
      horizontal
      style={styles.sectionMenu}
      data={sections}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <View
          style={
            index === 0
              ? [styles.sectionMenuItem, styles.sectionMenuItemActive]
              : styles.sectionMenuItem
          }>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={
                index === 0
                  ? [
                      styles.sectionMenuItemText,
                      styles.sectionMenuItemTextActive,
                    ]
                  : styles.sectionMenuItemText
              }>
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default RestaurantMenuHeader;
