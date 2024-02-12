import {SectionList, Text} from 'native-base';
import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import RestaurantMenuItem from './RestaurantMenuItem';

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

function RestaurantMenu({menu, onItemClick, isItemLoading, sections}) {
  const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 90});

  console.log('viewableItems');

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    console.log('viewableItems2');
    console.log(viewableItems);
  });

  return (
    <>
      true ? <Text>Test</Text> :{' '}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <RestaurantMenuItem item={item} onPress={onItemClick} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />
    </>
  );
}

export default RestaurantMenu;
