import React, { Component } from 'react'
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import { withTranslation } from 'react-i18next'

import AddressAutocomplete from './AddressAutocomplete'

const textInputContainerHeight = 54

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#e4022d',
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
      },
      ios: {
        top: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
})

class RestaurantSearch extends Component {

  renderButton() {

    const iconName = this.props.defaultValue ? 'times' : 'search'
    const iconSize = this.props.defaultValue ? 24 : 18

    let touchableProps = {}
    if (this.props.defaultValue) {
      touchableProps = {
        ...touchableProps,
        onPress: this.props.onReset,
      }
    }

    return (
      <TouchableOpacity
        style={{ paddingVertical: 5, paddingLeft: 10, paddingRight: 15 }}
        { ...touchableProps } >
        <Icon type="FontAwesome5" name={ iconName } style={{ color: '#ffffff', fontSize: iconSize }} />
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <View style={ [ styles.container, { width: this.props.width } ] }>
        <AddressAutocomplete
          googleApiKey={ this.props.googleApiKey }
          country={ this.props.country }
          onSelectAddress={ this.props.onSelect }
          containerStyle={{
            flex: 1,
            justifyContent: 'center',
          }}
          inputContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            borderWidth: 0,
            paddingLeft: 15,
            height: textInputContainerHeight,
          }}
          style={{
            height: (textInputContainerHeight * 0.7),
          }}
          onChangeText={ this.props.onChangeText }
          value={ this.props.defaultValue }
          renderRight={ this.renderButton.bind(this) } />
      </View>
    )
  }
}

export default withTranslation()(RestaurantSearch)
