import React from 'react'
import { StyleSheet } from 'react-native'
import { Icon } from 'native-base'

const styles = StyleSheet.create({
  small: {
    fontSize: 20,
  }
})

const resolve = order => {

  if (Object.prototype.hasOwnProperty.call(order, 'fulfillmentMethod')) {

    return order.fulfillmentMethod
  }

  if (Object.prototype.hasOwnProperty.call(order, 'takeaway')) {

    return order.takeaway ? 'collection' : 'delivery'
  }

  return 'delivery'
}

export default ({ order, small }) => {

  const fulfillmentMethod = resolve(order)

  return (
    <Icon type="FontAwesome"
      style={ small ? [ styles.small ] : [] }
      name={ fulfillmentMethod === 'collection' ? 'cube' : 'bicycle' } />
  )
}
