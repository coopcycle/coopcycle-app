import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'native-base'
import { translate } from 'react-i18next'

class RushModeAlert extends Component {
  render() {
    const { restaurant } = this.props

    if (restaurant && restaurant.state === 'rush') {
      return (
        <View style={ styles.container }>
          <Text style={ styles.text }>{ this.props.t('RESTAURANT_ALERT_RUSH_MODE_ON') }</Text>
        </View>
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#f2dede'
  },
  text: {
    color: '#a94442',
    textAlign: 'center'
  }
})

// export default RushModeAlert
export default translate()(RushModeAlert)
