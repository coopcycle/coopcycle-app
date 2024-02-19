import {FlatList} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
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
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const scrollToSection = index => {
    sectionRef.current.scrollToIndex({index: index + 3, viewOffset: 16});
  };

  useEffect(() => {
    if (sections.length === 0) return;
    let scrollTo = activeSection - 3;
    if (activeSection - 3 >= sections.length) {
      scrollTo = sections.length - 1;
    }
    if (activeSection <= 3) {
      scrollTo = 0;
    }
    setActive(scrollTo);
    return ref.current.scrollToIndex({
      index: scrollTo,
      viewOffset: 64,
    });
  }, [activeSection, sections.length]);

  const Item = ({item, index}) => (
    <View
      style={
        index === active
          ? [styles.sectionMenuItem, styles.sectionMenuItemActive]
          : styles.sectionMenuItem
      }>
      <TouchableOpacity onPress={() => scrollToSection(index)}>
        <View>
          <Text
            style={
              index === active
                ? [styles.sectionMenuItemText, styles.sectionMenuItemTextActive]
                : styles.sectionMenuItemText
            }>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      ref={ref}
      horizontal
      style={styles.sectionMenu}
      data={sections}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={Item}
    />
  );
};

export default RestaurantMenuHeader;
