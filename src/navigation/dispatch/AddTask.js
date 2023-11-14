import React, { Component } from 'react'
import { Appearance, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import {
  Box, Button,
  FormControl,
  HStack, Icon, Text, TextArea, VStack,
} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import moment from 'moment'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { createTask } from '../../redux/Dispatch/actions'
import AddressAutocomplete from '../../components/AddressAutocomplete'
import { whiteColor } from '../../styles/common'

class AddTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDoneAfterDateTimePickerVisible: false,
      isDoneBeforeDateTimePickerVisible: false,
      type: 'DROPOFF',
      doneAfter: moment().add(1, 'hours'),
      doneBefore: moment().add(1, 'hours').add(30, 'minutes'),
      address: {},
      comments: '',
    }
  }

  _handleDoneAfterDatePicked(date) {
    this.setState({
      doneAfter: moment(date),
      isDoneAfterDateTimePickerVisible: false,
    })
  }

  _hideDoneAfterDateTimePicker() {
    this.setState({ isDoneAfterDateTimePickerVisible: false })
  }

  _handleDoneBeforeDatePicked(date) {
    this.setState({
      doneBefore: moment(date),
      isDoneBeforeDateTimePickerVisible: false,
    })
  }

  _hideDoneBeforeDateTimePicker() {
    this.setState({ isDoneBeforeDateTimePickerVisible: false })
  }

  _createTask() {

    let task = {
      address: this.state.address,
      doneAfter: this.state.doneAfter,
      doneBefore: this.state.doneBefore,
      type: this.state.type,
      comments: this.state.comments,
    }

    this.props.createTask(task)
  }

  _onSelectAddress(address) {
    this.setState({
      address,
    })
  }

  _onEditAddressSubmit(address) {

    const newAddress = _.pickBy({
      ...this.state.address,
      ...address,
    }, prop => !_.isEmpty(prop))

    this.setState({
      address: newAddress,
    })
  }

  render() {

    const { navigate } = this.props.navigation

    let pickupBtnProps = {
      block: true,
    }
    let dropoffBtnProps = {
      block: true,
    }

    const { address, type, doneAfter, doneBefore } = this.state

    pickupBtnProps = {
      ...pickupBtnProps,
      variant: type === 'PICKUP' ? 'solid' : 'outline',
    }
    dropoffBtnProps = {
      ...dropoffBtnProps,
      variant: type === 'DROPOFF' ?  'solid' : 'outline',
    }

    const colorScheme = Appearance.getColorScheme()

    return (
      <Box p="3">
        <VStack>
          <FormControl style={ [ styles.formRow, { flexDirection: 'row' }] }>
            <Button flex={ 1 } mr="1" { ...pickupBtnProps } onPress={ () => this.setState({ type: 'PICKUP' }) }>
              Pickup
            </Button>
            <Button flex={ 1 } ml="1" { ...dropoffBtnProps } onPress={ () => this.setState({ type: 'DROPOFF' }) }>
              Dropoff
            </Button>
          </FormControl>
          <FormControl style={ styles.formRow }>
            <FormControl.Label style={{ marginBottom: 50 }}>{ this.props.t('TASK_FORM_ADDRESS_LABEL') }</FormControl.Label>
          </FormControl>
          <FormControl style={ [ styles.autocompleteContainer, { marginTop: 85 }] }>
            <AddressAutocomplete
              testID="taskFormTypeahead"
              country={ this.props.country }
              location={ this.props.location }
              address={ address }
              inputContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                borderWidth: 0,
              }}
              style={{
                borderRadius: 0,
                backgroundColor: colorScheme === 'dark' ? 'black' : whiteColor,
              }}
              onSelectAddress={ this._onSelectAddress.bind(this) }
              renderRight={ () => {

                if (!address.streetAddress) {
                  return null
                }

                return (
                  <TouchableOpacity style={ styles.editAddressBtn }
                    onPress={ () => navigate('DispatchEditAddress', { address, onSubmit: this._onEditAddressSubmit.bind(this) }) }>
                    <Icon as={FontAwesome} name="pencil" />
                  </TouchableOpacity>
                )
              } }
              />
          </FormControl>
          <FormControl style={ styles.formRow }>
            <FormControl.Label>{ this.props.t('TASK_FORM_DONE_AFTER_LABEL') }</FormControl.Label>
            <HStack>
              <View style={ styles.datePickerRow }>
                <Text>{ doneAfter.format('lll') }</Text>
                <Button size="sm" onPress={ () => this.setState({ isDoneAfterDateTimePickerVisible: true }) }>
                  { this.props.t('EDIT') }
                </Button>
              </View>
            </HStack>
          </FormControl>
          <FormControl style={ styles.formRow }>
            <FormControl.Label>{ this.props.t('TASK_FORM_DONE_BEFORE_LABEL') }</FormControl.Label>
            <HStack>
              <View style={ styles.datePickerRow }>
                <Text>{ doneBefore.format('lll') }</Text>
                <Button size="sm" onPress={ () => this.setState({ isDoneBeforeDateTimePickerVisible: true }) }>
                  { this.props.t('EDIT') }
                </Button>
              </View>
            </HStack>
          </FormControl>
          <FormControl style={ styles.formRow }>
            <FormControl.Label>{ this.props.t('TASK_FORM_COMMENTS_LABEL') }</FormControl.Label>
            <View>
              <TextArea rowSpan={ 5 } bordered onChangeText={text => this.setState({ comments: text })} />
            </View>
          </FormControl>
        </VStack>
        <Box>
          <Button onPress={ () => this._createTask() } testID="submitTaskForm">
            { this.props.t('DISPATCH_ADD_TASK') }
          </Button>
        </Box>
        <DateTimePicker
          mode="datetime"
          date={ doneAfter.toDate() }
          isVisible={ this.state.isDoneAfterDateTimePickerVisible }
          onConfirm={ this._handleDoneAfterDatePicked.bind(this) }
          onCancel={ this._hideDoneAfterDateTimePicker.bind(this) } />
        <DateTimePicker
          mode="datetime"
          date={ doneBefore.toDate() }
          isVisible={ this.state.isDoneBeforeDateTimePickerVisible }
          onConfirm={ this._handleDoneBeforeDatePicked.bind(this) }
          onCancel={ this._hideDoneBeforeDateTimePicker.bind(this) } />
      </Box>
    )
  }
}

const styles = StyleSheet.create({
  formRow: {
    marginBottom: 15,
  },
  datePickerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editAddressBtn: {
    width: 50,
    position: 'absolute',
    right: 0,
    backgroundColor: '#e5e5e5',
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  // @see https://github.com/mrlaessig/react-native-autocomplete-input#android
  autocompleteContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'red',
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
        right: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
})

function mapStateToProps(state) {
  return {
    country: state.app.settings.country,
    location: state.app.settings.latlng,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTask: task => dispatch(createTask(task)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddTask))
