import React, {useState, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityBase,
} from 'react-native';
import {
  Column,
  FlatList,
  Flex,
  Heading,
  Image,
  Row,
  Text,
  View,
} from 'native-base';
import _ from 'lodash';
import {formatPrice} from '../utils/formatting';
import ItemSeparator from './ItemSeparator';
import MenuItem from './RestaurantMenuItem';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const ITEM_HEIGHT = 50; // Adjust this value based on your design

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

function RestaurantMenu({menu, onItemClick, isItemLoading}) {
  let sections = [];
  if (menu) {
    _.forEach(menu.hasMenuSection, (menuSection, index) => {
      sections.push({
        title: menuSection.name,
        data: menuSection.hasMenuItem,
        index,
      });
    });
  }

  return (
    <View>
      <FlatList
        horizontal
        style={styles.sectionMenu}
        data={[...sections, ...sections, ...sections, ...sections]}
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
      <ScrollView vertical={true}>
        {[...sections, ...sections, ...sections, ...sections].map(
          (section, index) => (
            <View key={index}>
              <Text>{section.title}</Text>
              {/* <Text>{JSON.stringify(section.data[0])}</Text> */}
            </View>
          ),
        )}
      </ScrollView>
    </View>
  );
}

export default RestaurantMenu;
