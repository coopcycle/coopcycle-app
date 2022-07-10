import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Icon, Text, useColorMode } from 'native-base'
import { SwipeRow } from 'react-native-swipe-list-view'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

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

const swipeRow = React.createRef()

const Comp = ({ onAccept, onRefuse }) => {

  const { colorMode } = useColorMode()
  const { t } = useTranslation()

  const onSwipeValueChange = ({ key, value }) => {
    // TODO Animate color
  }

  const onRowOpen = (value) => {
    if (value > 0) {
      onAccept()
    } else {
      onRefuse()
    }
    setTimeout(() => swipeRow.current?.closeRow(), 250)
  }

  const [ openValue, setOpenValue ] = useState(0)

  return (
    <View>
      <View
        style={{ padding: 20 }}
        onLayout={ event => setOpenValue(event.nativeEvent.layout.width * 0.7) }>
        <SwipeRow
          leftOpenValue={ openValue }
          rightOpenValue={ (openValue * -1) }
          onRowOpen={ onRowOpen }
          onSwipeValueChange={ onSwipeValueChange }
          ref={ swipeRow }>
          <View style={ styles.swipeBg }>
            <Text>{ t('RESTAURANT_ORDER_BUTTON_ACCEPT') }</Text>
            <Text>{ t('RESTAURANT_ORDER_BUTTON_REFUSE') }</Text>
          </View>
          <View style={ [ styles.swipeFg, { backgroundColor: colorMode === 'dark' ? 'black' : 'white' } ] }>
            <Icon as={FontAwesome} name="angle-double-left" />
            <Icon as={FontAwesome} name="angle-double-right" />
          </View>
        </SwipeRow>
      </View>
      <Text note style={{ textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 }}>{ t('SWIPE_TO_ACCEPT_REFUSE') }</Text>
    </View>
  )
}

export default Comp
