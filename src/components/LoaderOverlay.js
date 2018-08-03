import React, { Component } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { Text } from 'native-base'
import { translate } from 'react-i18next'

class LoaderOverlay extends Component {

  render() {
    if (this.props.loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff" />
          <Text style={{ color: '#fff' }}>
            { this.props.t('LOADING') }
          </Text>
        </View>
      )
    }

    return (
      <View />
    )
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
});

export default translate()(LoaderOverlay)
