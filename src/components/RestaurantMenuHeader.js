import {FlatList, useColorModeValue} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  sectionMenu: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#201E1E',
  },
  sectionMenuItem: {
    borderBottomWidth: 1,
  },
  sectionMenuItemText: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});

const RestaurantMenuHeader = ({sections, sectionRef, activeSection}) => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const backgroundColor = useColorModeValue('#fff', '#201E1E');
  const inactiveText = useColorModeValue('gray', 'rgba(255,255,255,.5)');
  const inactiveBorderBottomColor = useColorModeValue(
    'lightgray',
    'rgba(255,255,255,.25)',
  );
  const activeBorderBottomColor = useColorModeValue('red', '#fff');

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
          ? [
              styles.sectionMenuItem,
              {borderBottomColor: activeBorderBottomColor},
            ]
          : [
              styles.sectionMenuItem,
              {borderBottomColor: inactiveBorderBottomColor},
            ]
      }>
      <TouchableOpacity onPress={() => scrollToSection(index)}>
        <View>
          <Text
            style={
              index === active
                ? [styles.sectionMenuItemText, {color: activeBorderBottomColor}]
                : [styles.sectionMenuItemText, {color: inactiveText}]
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
      style={([styles.sectionMenu], {backgroundColor})}
      data={sections}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={Item}
    />
  );
};

export default RestaurantMenuHeader;
