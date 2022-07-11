import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Icon, Text } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const asProp = name => {
  switch (name) {
    case 'FontAwesome':
      return FontAwesome
    case 'FontAwesome5':
      return FontAwesome5
  }

  return Ionicons
}

class HeaderButton extends Component {

  render() {

    const containerStyles = [styles.base]
    if (this.props.textLeft) {
      containerStyles.push(styles.withText)
    }

    let iconStyle = [{ color: '#fff' }]
    if (this.props.iconStyle) {
      iconStyle.push(this.props.iconStyle)
    }

    let otherProps = {}
    if (this.props.testID) {
      otherProps = {
        ...otherProps,
        testID: this.props.testID,
      }
    }

    return (
      <TouchableOpacity
        onPress={ this.props.onPress }
        style={ containerStyles }
        { ...otherProps }>
        { this.props.textLeft && (
          <Text style={ styles.textLeft }>{ this.props.textLeft }</Text>
        )}
        <Icon as={ asProp(this.props.iconType) } name={ this.props.iconName } style={ iconStyle } />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  withText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLeft: {
    color: '#fff',
    paddingRight: 15,
  },
})

export default HeaderButton
