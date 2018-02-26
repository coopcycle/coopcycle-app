import React, { Component } from 'react'
import { Text, Button, Icon, Header, Left, Right, Title, Body } from 'native-base'
import { TextInput, View } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import moment from 'moment/min/moment-with-locales'
import AppConfig from '../AppConfig'

moment.locale(AppConfig.LOCALE)

export default class DateTimePicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      textInputValue: ''
    }
  }

  onChange(option) {
    this.setState({ textInputValue: option.label })
    this.props.onChange(option.deliveryDate)
  }

  reset() {
    this.setState({ textInputValue: '' })
    this.props.onChange(null)
  }

  render() {

    let index = 0
    const data = [
      { key: index++, label: "Aujourd'hui", deliveryDate: moment() },
      { key: index++, label: "Demain", deliveryDate: moment().add(1, 'days') },
    ]

    return (
      <ModalSelector
        selectStyle={{ borderWidth: 0  }}
        selectTextStyle={{ color: '#fff' }}
        cancelText={ 'Annuler' }
        animationType={ 'fade' }
        data={ data }
        initValue={ 'Quand ?' }
        onChange={ this.onChange.bind(this) }>
        <TextInput
          style={{ borderWidth: 0, color: '#fff', width: 80, textAlign: 'center' }}
          editable={ false }
          placeholder="Quand ?"
          value={ this.state.textInputValue } />
      </ModalSelector>
    )
  }
}
