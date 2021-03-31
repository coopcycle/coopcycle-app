import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Icon, Text, Button } from 'native-base'
import { SwipeRow } from 'react-native-swipe-list-view'

const styles = StyleSheet.create({
  swipeBg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
    paddingHorizontal: 30,
  },
  swipeFg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 3,
    borderColor: '#e7e7e7',
    backgroundColor: '#ffffff',
  },
});

const swipeRow = React.createRef()

const Comp = ({ onAccept, onRefuse }) => {

  const { t } = useTranslation()

  const onSwipeValueChange = ({ key, value }) => {
    // TODO Animate color
  }

  const onRowOpen = (value) => {

    console.log('onRowOpen')

    if (value > 0) {
      onAccept()
      // this.props.acceptOrder(this.props.order, order => this.props.navigation.setParams({ order }))
    } else {
      onRefuse()
      // this.props.navigation.navigate('RestaurantOrderRefuse', { order: this.props.order })
    }
    setTimeout(() => swipeRow.current.closeRow(), 250)
  }

  const [ openValue, setOpenValue ] = useState(0)

  return (
    <View style={{ backgroundColor: '#efefef' }}>
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
          <View style={ styles.swipeFg }>
            <Icon type="FontAwesome" name="angle-double-left" />
            <Icon type="FontAwesome" name="angle-double-right" />
          </View>
        </SwipeRow>
      </View>
      <Text note style={{ textAlign: 'center', marginBottom: 20 }}>{ t('SWIPE_TO_ACCEPT_REFUSE') }</Text>
    </View>
  )
}

export default Comp
