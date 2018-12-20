import React, { Component } from 'react'
import { FlatList, InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { connect } from 'react-redux'
import {
  Container, Content,
  Text, Button,
  Form, Item, Label, Textarea, Radio,
  List, ListItem,
  Left, Right,
  Footer, FooterTab
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { translate } from 'react-i18next'
import _ from 'lodash'
import moment from 'moment'

import { createTask } from '../../redux/Dispatch/actions'
import LoaderOverlay from '../../components/LoaderOverlay'
import Settings from '../../Settings'
import { localeDetector } from '../../i18n'

const autocompleteStyles = {
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  textInputContainer: {
    backgroundColor: '#C9C9CE',
    height: 54,
    // borderTopColor: '#7e7e7e',
    // borderBottomColor: '#b5b5b5',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 38,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    flex: 1
  },
}

class AddTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDoneAfterDateTimePickerVisible: false,
      isDoneBeforeDateTimePickerVisible: false,
      type: 'DROPOFF',
      doneAfter: moment().add(1, 'hours'),
      doneBefore: moment().add(1, 'hours').add(30, 'minutes'),
      address: {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.unassignedTasks !== prevProps.unassignedTasks) {
      this.props.navigation.goBack()
    }
  }

  _handleDoneAfterDatePicked(date) {
    this.setState({
      doneAfter: moment(date),
      isDoneAfterDateTimePickerVisible: false
    })
  }

  _hideDoneAfterDateTimePicker() {
    this.setState({ isDoneAfterDateTimePickerVisible: false })
  }

  _handleDoneBeforeDatePicked(date) {
    this.setState({
      doneBefore: moment(date),
      isDoneBeforeDateTimePickerVisible: false
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
    }

    this.props.createTask(task)
  }

  render() {

    const { navigate } = this.props.navigation

    let pickupBtnProps = {
      block: true
    }
    let dropoffBtnProps = {
      block: true
    }

    const { type, doneAfter, doneBefore } = this.state

    pickupBtnProps = {
      ...pickupBtnProps,
      primary: type === 'PICKUP',
      bordered: type !== 'PICKUP'
    }
    dropoffBtnProps = {
      ...dropoffBtnProps,
      primary: type === 'DROPOFF',
      bordered: type !== 'DROPOFF'
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
              <Label>{ this.props.t('TASK_FORM_ADDRESS_LABEL') }</Label>
              <GooglePlacesAutocomplete
                placeholder={ this.props.t('ENTER_ADDRESS') }
                minLength={ 2 } // minimum length of text to search
                autoFocus={ false }
                // listViewDisplayed = auto does not hide the results when pressed
                listViewDisplayed={ false }
                fetchDetails={ true }
                // 'details' is provided when fetchDetails = true
                onPress={(data, details = null) => {
                  this.setState({
                    address: {
                      streetAddress: details.formatted_address,
                      geo: {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                      }
                    }
                  })
                }}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: Settings.get('google_api_key'),
                  language: localeDetector(), // language of the results
                  types: 'geocode', // default: 'geocode'
                }}
                styles={ autocompleteStyles }
                // suppressDefaultStyles={ false }
                nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  region: Settings.get('country')
                }}
                // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                filterReverseGeocodingByTypes={[ 'street_address', 'route', 'geocode' ]} />
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
                <Textarea rowSpan={ 5 } bordered />
              </View>
            </View>
          </Form>
        </Content>
        <Footer>
          <FooterTab style={{ backgroundColor: '#3498DB' }}>
            <Button full onPress={ () => this._createTask() }>
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
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  formRow: {
    marginBottom: 15
  },
  datePickerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

function mapStateToProps(state) {
  return {
    unassignedTasks: state.dispatch.unassignedTasks,
    loading: state.dispatch.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTask: task => dispatch(createTask(task)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddTask))
