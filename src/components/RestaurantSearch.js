import React, { Component } from 'react'
import { Platform, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
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
  textInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: textInputContainerHeight,
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

  renderTextInput(props) {

    return (
      <View style={ styles.textInput }>
        <TextInput { ...props } style={ [ props.style, { flex: 1 } ] } />
        { this.renderButton() }
      </View>
    )
  }

  render() {

    return (
      <View style={ [ styles.container, { width: this.props.width } ] }>
        <AddressAutocomplete
          googleApiKey={ this.props.googleApiKey }
          country={ this.props.country }
          placeholder={ this.props.t('ENTER_ADDRESS') }
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
          }}
          listStyle={{
            margin: 0,
          }}
          style={{
            backgroundColor: 'white',
            borderColor: '#b9b9b9',
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderWidth: 0,
          }}
          onChangeText={ this.props.onChangeText }
          value={ this.props.defaultValue }
          renderTextInput={ props => this.renderTextInput(props) } />
      </View>
    )
  }
}

export default withTranslation()(RestaurantSearch)
