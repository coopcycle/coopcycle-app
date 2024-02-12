import {FlatList} from 'native-base';
import React, {useEffect, useRef} from 'react';
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    color: 'gray',
  },
  sectionMenuItemTextActive: {
    color: 'red',
  },
  sectionMenuItemActive: {
    borderBottomColor: 'red',
  },
});

const RestaurantMenuHeader = ({sections, sectionRef, activeSection}) => {
  const ref = useRef(null);
  const scrollToSection = index => {
    sectionRef.current.scrollToIndex({index: index + 3, viewOffset: 16});
  };

  useEffect(() => {
    if (activeSection < 3) return;
    ref.current.scrollToIndex({index: activeSection - 3, viewOffset: 64});
  }, [activeSection]);

  return (
    <FlatList
      ref={ref}
      horizontal
      style={styles.sectionMenu}
      data={sections}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <View
          style={
            index === activeSection - 3 || (activeSection === 0 && index === 0)
              ? [styles.sectionMenuItem, styles.sectionMenuItemActive]
              : styles.sectionMenuItem
          }>
          <TouchableOpacity onPress={() => scrollToSection(index)}>
            <View>
              <Text
                style={
                  index === activeSection - 3 ||
                  (activeSection === 0 && index === 0)
                    ? [
                        styles.sectionMenuItemText,
                        styles.sectionMenuItemTextActive,
                      ]
                    : styles.sectionMenuItemText
                }>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default RestaurantMenuHeader;
