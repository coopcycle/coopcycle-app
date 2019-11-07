import React, { Component } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Icon } from 'native-base'

import AddressTypeahead from './AddressTypeahead'

const textInputContainerHeight = 54
const textInputPaddingVertical = 7.5
const textInputHeight = (textInputContainerHeight - (textInputPaddingVertical * 2))

const styles = StyleSheet.create({
  container : {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    overflow: 'visible',
    backgroundColor: '#e4022d',
  },
  leftButton: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const typeaheadStyle = {
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    height: textInputContainerHeight,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: textInputHeight,
    marginTop: textInputPaddingVertical,
    marginLeft: 0,
    marginRight: 20,
  },
  row: {
    backgroundColor: '#ffffff',
  },
}

export default class RestaurantSearch extends Component {

  _onAddressChange(address) {
    this.props.onChange(address)
  }

  renderLeftButton() {
    return (
      <View style={ styles.leftButton }>
        <Icon type="FontAwesome" name="search" style={{ color: '#fff', fontSize: 18 }} />
      </View>
    )
  }

  render() {

    const { width } = Dimensions.get('window')

    return (
      <View style={ [ styles.container, { width } ] }>
        <View style={{ flex: 1 }}>
          <AddressTypeahead
            style={ typeaheadStyle }
            renderLeftButton={ () => this.renderLeftButton() }
            onPress={ this._onAddressChange.bind(this) }
            defaultValue={ this.props.defaultValue } />
        </View>
      </View>
    )
  }
}
