import React, { Component } from 'react'
import { Text, Button, Icon, Header, Left, Right, Title, Body } from 'native-base'
import { TextInput, View } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import moment from 'moment/min/moment-with-locales'
import { translate } from 'react-i18next'
import { localeDetector } from '../i18n'

moment.locale(localeDetector())

class DateTimePicker extends Component {

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
      { key: index++, label: this.props.t('TODAY'), deliveryDate: moment() },
      { key: index++, label: this.props.t('TOMORROW'), deliveryDate: moment().add(1, 'days') },
    ]

    return (
      <ModalSelector
        selectStyle={{ borderWidth: 0  }}
        selectTextStyle={{ color: '#fff' }}
        cancelText={ this.props.t('CANCEL') }
        animationType={ 'fade' }
        data={ data }
        initValue={ `${this.props.t('WHEN')} ?` }
        onChange={ this.onChange.bind(this) }>
        <TextInput
          style={{ borderWidth: 0, color: '#fff', width: 80, textAlign: 'center' }}
          editable={ false }
          placeholder={ `${this.props.t('WHEN')} ?` }
          value={ this.state.textInputValue } />
      </ModalSelector>
    )
  }
}

export default translate()(DateTimePicker)
