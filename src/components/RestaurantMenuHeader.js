import {
  FlatList,
  HStack,
  Skeleton,
  VStack,
  useColorModeValue,
} from 'native-base';
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

const RestaurantMenuHeader = ({
  sections,
  sectionRef,
  activeSection,
  isLoading,
}) => {
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

  const backgroundColor2 = useColorModeValue('#fff', '#201E1E');
  const loadingSkeleton = (
    <HStack
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'left',
          marginVertical: 8,
          marginHorizontal: 16,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        },
        {backgroundColor: backgroundColor2},
      ]}
      space={6}
      p="4">
      <Skeleton flex="1" h="100%" w="100" rounded="md" />
      <VStack flex="3" space="3">
        <Skeleton.Text flex={1} lines={1} />
        <Skeleton.Text flex={1} lines={3} />
        <HStack flex={1} space="2" alignItems="center">
          <Skeleton h="3" flex="2" rounded="full" />
          <View style={{flex: 1.8}} />
          <Skeleton h="3" flex="1" rounded="full" />
        </HStack>
      </VStack>
    </HStack>
  );

  return (
    <>
      {isLoading && (
        <>
          <HStack w="100%" space={6} p="4" style={{backgroundColor}}>
            <Skeleton.Text flex={1} lines={1} />
            <Skeleton.Text flex={1} lines={1} />
            <Skeleton.Text flex={1} lines={1} />
            <Skeleton.Text flex={1} lines={1} />
          </HStack>
          <HStack p="4" width="50%">
            <Skeleton.Text flex={1} lines={1} />
          </HStack>
          {loadingSkeleton}
          {loadingSkeleton}
          {loadingSkeleton}
        </>
      )}
      <FlatList
        ref={ref}
        horizontal
        style={([styles.sectionMenu], {backgroundColor})}
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={Item}
      />
    </>
  );
};

export default RestaurantMenuHeader;
