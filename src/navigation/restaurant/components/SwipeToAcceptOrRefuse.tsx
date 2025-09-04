import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';

const styles = StyleSheet.create({
  swipeBg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  swipeFg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 3,
    borderColor: '#e7e7e7',
  },
});

const swipeRow = React.createRef();

const Comp = ({ onAccept, onRefuse }) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const onSwipeValueChange = ({ key, value }) => {
    // TODO Animate color
  };

  const onRowOpen = value => {
    if (value > 0) {
      onAccept();
    } else {
      onRefuse();
    }
    setTimeout(() => swipeRow.current?.closeRow(), 250);
  };

  const [openValue, setOpenValue] = useState(0);

  return (
    <View>
      <View
        style={{ padding: 20 }}
        onLayout={event => setOpenValue(event.nativeEvent.layout.width * 0.7)}>
        <SwipeRow
          leftOpenValue={openValue}
          rightOpenValue={openValue * -1}
          onRowOpen={onRowOpen}
          onSwipeValueChange={onSwipeValueChange}
          ref={swipeRow}>
          <View style={styles.swipeBg}>
            <Text>{t('RESTAURANT_ORDER_BUTTON_ACCEPT')}</Text>
            <Text>{t('RESTAURANT_ORDER_BUTTON_REFUSE')}</Text>
          </View>
          <View
            style={[
              styles.swipeFg,
              { backgroundColor: colorScheme === 'dark' ? 'black' : 'white' },
            ]}>
            <Icon as={ChevronsLeft} />
            <Icon as={ChevronsRight} />
          </View>
        </SwipeRow>
      </View>
      <Text
        note
        style={{
          textAlign: 'center',
          marginBottom: 20,
          paddingHorizontal: 10,
        }}>
        {t('SWIPE_TO_ACCEPT_REFUSE')}
      </Text>
    </View>
  );
};

export default Comp;
