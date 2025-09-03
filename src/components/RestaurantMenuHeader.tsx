import {
  Skeleton,
  useColorModeValue,
} from 'native-base';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useBackgroundContainerColor, usePrimaryColor } from '../styles/theme';

const styles = StyleSheet.create({
  sectionMenu: {
    display: 'flex',
    flexDirection: 'row',
  },
  sectionMenuItem: {
    borderBottomWidth: 1,
  },
  sectionMenuItemText: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});

const ItemSkeleton = () => {

  const backgroundColor = useBackgroundContainerColor();

  return (
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
        },
        { backgroundColor: backgroundColor },
      ]}
      space="lg"
      className="p-4">
      <Skeleton flex="1" h="100%" w="100" rounded="md" />
      <VStack flex={3} space="md">
        <Skeleton.Text flex={1} lines={1} />
        <Skeleton.Text flex={1} lines={3} />
        <HStack flex={1} space="md" className="items-center">
          <Skeleton h="3" flex="2" rounded="full" />
          <View style={{ flex: 1.8 }} />
          <Skeleton h="3" flex="1" rounded="full" />
        </HStack>
      </VStack>
    </HStack>
  )
}

const RestaurantMenuHeader = ({
  sections, // menuSections
  sectionRef,
  activeSection, // activeSection in the parent FlatList
  offsetSectionsCount, // number of sections in the parent FlatList before the menu
  isLoading,
}) => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const backgroundColor = useBackgroundContainerColor();
  const inactiveText = useColorModeValue('gray', 'rgba(255,255,255,.5)');
  const inactiveBorderBottomColor = useColorModeValue(
    'lightgray',
    'rgba(255,255,255,.25)',
  );
  const activeBorderBottomColor = usePrimaryColor();

  const scrollToSection = index => {
    sectionRef.current.scrollToIndex({
      index: index + offsetSectionsCount,
      viewOffset: 16,
    });
  };

  useEffect(() => {
    if (sections.length === 0) return;
    let scrollTo = activeSection - offsetSectionsCount;
    if (activeSection - offsetSectionsCount >= sections.length) {
      scrollTo = sections.length - 1;
    }
    if (activeSection <= offsetSectionsCount) {
      scrollTo = 0;
    }
    setActive(scrollTo);
    return ref.current.scrollToIndex({
      index: scrollTo,
      viewOffset: 64,
    });
  }, [activeSection, offsetSectionsCount, sections.length]);

  const Item = ({ item, index }) => (
    <View
      style={
        index === active
          ? [
              styles.sectionMenuItem,
              { borderBottomColor: activeBorderBottomColor },
            ]
          : [
              styles.sectionMenuItem,
              { borderBottomColor: inactiveBorderBottomColor },
            ]
      }>
      <TouchableOpacity onPress={() => scrollToSection(index)}>
        <View>
          <Text
            style={
              index === active
                ? [
                    styles.sectionMenuItemText,
                    { color: activeBorderBottomColor },
                  ]
                : [styles.sectionMenuItemText, { color: inactiveText }]
            }>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {isLoading && (
        <>
          <HStack className="w-full p-4 mb-4" space="lg" style={{ backgroundColor }}>
            <Skeleton.Text flex={1} lines={1} />
            <Skeleton.Text flex={1} lines={1} />
            <Skeleton.Text flex={1} lines={1} />
            <Skeleton.Text flex={1} lines={1} />
          </HStack>
          <HStack className="w-1/2 p-4">
            <Skeleton.Text flex={1} lines={1} />
          </HStack>
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </>
      )}
      <FlatList
        ref={ref}
        horizontal
        style={([styles.sectionMenu], { backgroundColor })}
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={Item}
      />
    </>
  );
};

export default RestaurantMenuHeader;
