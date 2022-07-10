import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { HStack, Icon, Pressable, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class DatePickerHeader extends Component {

  render() {

    const { width } = Dimensions.get('window')
    const { date } = this.props

    let dateFormat = 'L'
    if (width > 400) {
      dateFormat = 'dddd LL'
    }

    return (
      <HStack w="100%">
        <Pressable w="50%" onPress={ () => this.props.onCalendarClick() }>
          <HStack flex={ 1 } alignItems="center" justifyContent="space-between" p="2">
            <Icon as={FontAwesome} name="calendar" />
            <Text>{ date.format(dateFormat) }</Text>
            <Icon as={FontAwesome} name="chevron-right" style={{ color: '#ddd' }} />
          </HStack>
        </Pressable>
        <Pressable w="50%" onPress={ () => this.props.onTodayClick() }>
          <HStack alignItems="center" justifyContent="space-between" p="2" bgColor="#2ECC71">
            <Icon as={FontAwesome} name="refresh" />
            <Text>{ this.props.t('TODAY') }</Text>
          </HStack>
        </Pressable>
      </HStack>
    )
  }
}

export default withTranslation()(DatePickerHeader)
