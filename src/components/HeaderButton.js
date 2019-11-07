import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Text, Icon } from 'native-base'

class HeaderButton extends Component {

  render() {

    const containerStyles = [ styles.base ]
    if (this.props.textLeft) {
      containerStyles.push(styles.withText)
    }

    let iconProps = {}
    if (this.props.iconType) {
      iconProps = {
        ...iconProps,
        type: this.props.iconType,
      }
    }

    let iconStyle = [ { color: '#fff' } ]
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
        <Icon name={ this.props.iconName } style={ iconStyle } { ...iconProps } />
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
