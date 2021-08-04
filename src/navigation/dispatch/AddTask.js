import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Content,
  Text, Button,
  Form, Label, Textarea,
  Footer, FooterTab,
  Icon,
} from 'native-base'
import { Col, Grid } from 'react-native-easy-grid'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import moment from 'moment'

import { createTask } from '../../redux/Dispatch/actions'
import AddressAutocomplete from '../../components/AddressAutocomplete'

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
      primary: type === 'PICKUP',
      bordered: type !== 'PICKUP',
    }
    dropoffBtnProps = {
      ...dropoffBtnProps,
      primary: type === 'DROPOFF',
      bordered: type !== 'DROPOFF',
    }

    return (
      <Container>
        <Content padder>
          <Form>
            <View style={ styles.formRow }>
              <Grid>
                <Col>
                  <Button { ...pickupBtnProps } onPress={ () => this.setState({ type: 'PICKUP' }) }>
                    <Text>Pickup</Text>
                  </Button>
                </Col>
                <Col>
                  <Button { ...dropoffBtnProps } onPress={ () => this.setState({ type: 'DROPOFF' }) }>
                    <Text>Dropoff</Text>
                  </Button>
                </Col>
              </Grid>
            </View>
            <View style={ styles.formRow }>
              <Label style={{ marginBottom: 5 }}>{ this.props.t('TASK_FORM_ADDRESS_LABEL') }</Label>
              <View style={ styles.datePickerRow }>
                { address.streetAddress && (
                  <TouchableOpacity style={ styles.editAddressBtn }
                    onPress={ () => navigate('DispatchEditAddress', { address, onSubmit: this._onEditAddressSubmit.bind(this) }) }>
                    <Icon type="FontAwesome" name="pencil" style={{ color: '#333333' }} />
                  </TouchableOpacity>
                )}
                <AddressAutocomplete
                  country={ this.props.country }
                  location={ this.props.location }
                  address={ address }
                  inputContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    borderWidth: 0,
                    marginRight: address.streetAddress ? 50 : 0,
                  }}
                  style={{ borderRadius: 0 }}
                  onSelectAddress={ this._onSelectAddress.bind(this) }
                  />
              </View>
            </View>
            <View style={ styles.formRow }>
              <Label>{ this.props.t('TASK_FORM_DONE_AFTER_LABEL') }</Label>
              <View style={ styles.datePickerRow }>
                <Text>{ doneAfter.format('lll') }</Text>
                <Button onPress={ () => this.setState({ isDoneAfterDateTimePickerVisible: true }) }>
                  <Text>{ this.props.t('EDIT') }</Text>
                </Button>
              </View>
            </View>
            <View style={ styles.formRow }>
              <Label>{ this.props.t('TASK_FORM_DONE_BEFORE_LABEL') }</Label>
              <View style={ styles.datePickerRow }>
                <Text>{ doneBefore.format('lll') }</Text>
                <Button onPress={ () => this.setState({ isDoneBeforeDateTimePickerVisible: true }) }>
                  <Text>{ this.props.t('EDIT') }</Text>
                </Button>
              </View>
            </View>
            <View style={ styles.formRow }>
              <Label>{ this.props.t('TASK_FORM_COMMENTS_LABEL') }</Label>
              <View>
                <Textarea rowSpan={ 5 } bordered onChangeText={text => this.setState({ comments: text })} />
              </View>
            </View>
          </Form>
        </Content>
        <Footer style={{ backgroundColor: '#3498DB' }}>
          <FooterTab style={{ backgroundColor: '#3498DB' }}>
            <Button full onPress={ () => this._createTask() } testID="submitTaskForm">
              <Text style={{ fontSize: 18, color: '#fff' }}>{ this.props.t('DISPATCH_ADD_TASK') }</Text>
            </Button>
          </FooterTab>
        </Footer>
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
      </Container>
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
