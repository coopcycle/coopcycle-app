import React, { Component, useEffect, useMemo, useState } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Skeleton,
  Text,
  TextArea,
  VStack,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import Modal from 'react-native-modal'
import { Formik } from 'formik'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import {
  deletePictureAt,
  deleteSignatureAt,
  markTaskDone,
  markTaskFailed,
  markTasksDone,
  selectIsTaskCompleteFailure,
  selectPictures,
  selectSignatures,
} from '../../redux/Courier'
import { greenColor, yellowColor } from '../../styles/common'
import { doneIconName, incidentIconName } from './styles/common'
import ModalContent from '../../components/ModalContent'
import { Picker } from '../../components/Picker'
import { useQuery } from 'react-query';

const DELETE_ICON_SIZE = 32
const CONTENT_PADDING = 20

const AttachmentItem = ({ base64, onPressDelete }) => {

  const { width } = Dimensions.get('window')

  const imageSize = (width - 64) / 2

  if (!base64.startsWith('file://') && !base64.startsWith('data:image/jpeg;base64')) {
    base64 = `data:image/jpeg;base64,${base64}`
  }

  return (
    <View
      style={ [ styles.image, { width: imageSize, height: imageSize }] }>
      <Image
        source={{ uri: base64 }}
        style={{ width: (imageSize - 2), height: (imageSize - 2) }} />
      <TouchableOpacity
        style={ styles.imageDelBtn }
        onPress={ onPressDelete }>
        <Icon as={ FontAwesome5 } name="times-circle" />
      </TouchableOpacity>
    </View>
  )
}

const FailureReasonPicker = ({ task, httpClient, onValueChange }) => {

  const [ selectedFailureReason, setFailureReason ] = useState(null)

  const { data, isSuccess, isError } = useQuery([ 'task', 'failure_reasons', task['@id'] ], async () => {
    return await httpClient.get(`${task['@id']}/failure_reasons`)
  })

  const values = useMemo(() => {
    if (!isSuccess)
      {return null}
    return data['hydra:member'].map((value, index) => <Picker.Item key={index} value={value.code} label={value.description}  /> )
  },
    [ data, isSuccess ])

  useEffect(() => {
    if (!isSuccess) { return }
    onValueChange(selectedFailureReason)
  }, [ selectedFailureReason, onValueChange, isSuccess ]);


  if (isError)
    {return <Text color="red.500">Failure reasons are not available</Text>}

  return <Skeleton isLoaded={isSuccess} rounded={2}>
    <Picker selectedValue={selectedFailureReason}
            onValueChange={v => setFailureReason(v)}
    >
      <Picker.Item value={null} label="" />
      {values}
    </Picker>
  </Skeleton>
}

class CompleteTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notes: '',
      failureReason: null,
      isContactNameModalVisible: false,
      contactName: '',
      isKeyboardVisible: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.failureReason !== nextState.failureReason;
  }

  markTaskDone() {

    const task = this.props.route.params?.task
    const tasks = this.props.route.params?.tasks
    const { notes } = this.state

    if (tasks && tasks.length) {
      this.props.markTasksDone(this.props.httpClient, tasks, notes, () => {
        this.props.navigation.navigate({ name: this.props.route.params?.navigateAfter, merge: true })
      }, this.state.contactName)
    } else {
      this.props.markTaskDone(this.props.httpClient, task, notes, () => {
        // Make sure to use merge = true, so that it doesn't break
        // when navigating to DispatchTaskList
        this.props.navigation.navigate({ name: this.props.route.params?.navigateAfter, merge: true })
      }, this.state.contactName)
    }

  }

  markTaskFailed() {

    const task = this.props.route.params?.task
    const { notes, failureReason } = this.state

    this.props.markTaskFailed(this.props.httpClient, task, failureReason, notes, () => {
      // Make sure to use merge = true, so that it doesn't break
      // when navigating to DispatchTaskList
      this.props.navigation.navigate({ name: this.props.route.params?.navigateAfter, merge: true })
    }, this.state.contactName)
  }

  onSwipeComplete() {
    this.setState({ isContactNameModalVisible: false })
  }

  _validate(values) {
    if (_.isEmpty(values.contactName)) {

      return {
        contactName: this.props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME'),
      }
    }

    return {}
  }

  _onSubmit(values) {
    this.setState({
      contactName: values.contactName,
      isContactNameModalVisible: false,
    })
  }

  resolveContactName() {
    let task = this.props.route.params?.task
    const tasks = this.props.route.params?.tasks

    if (!task && tasks && tasks.length) {
      task = tasks[0]
    }

    if (!_.isEmpty(this.state.contactName)) {
      return this.state.contactName
    }

    return !_.isEmpty(task.address.contactName) ? task.address.contactName : ''
  }

  componentDidMount() {
    this.showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      this.setState({ isKeyboardVisible: true })
    })
    this.hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({ isKeyboardVisible: false })
    })
  }

  componentWillUnmount() {
    this.showSubscription.remove()
    this.hideSubscription.remove()
  }

  multipleTasksLabel(tasks) {
    return tasks.reduce((label, task, idx) => {
      return `${label}${idx !== 0 ? ',' : ''} #${task.id}`
    }, `${this.props.t('COMPLETE_TASKS')}: `)
  }

  isDropoff() {
    const task = this.props.route.params?.task
    const tasks = this.props.route.params?.tasks

    if (tasks && tasks.length > 1) {
      return tasks.every(t => t.type === 'DROPOFF')
    } else if (tasks && tasks.length === 1) {
      return tasks[0].type === 'DROPOFF'
    }
    return task && task.type === 'DROPOFF'
  }

  render() {

    const task = this.props.route.params?.task
    const tasks = this.props.route.params?.tasks
    const success = Object.prototype.hasOwnProperty.call(this.props.route.params || {}, 'success') ?
      this.props.route.params?.success : true


    const buttonIconName = success ? doneIconName : incidentIconName
    const footerBgColor = success ? greenColor : yellowColor
    const footerText = success ? this.props.t('VALIDATE') : this.props.t('MARK_FAILED')
    const onPress = success ? this.markTaskDone.bind(this) : this.markTaskFailed.bind(this)

    const contactName = this.resolveContactName()

    const initialValues = {
      contactName,
    }

    return (
      <React.Fragment>
        <KeyboardAvoidingView flex={ 1 }
          behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
          <VStack flex={ 1 }>
            {
              tasks && tasks.length ?
              <Text mt={2} ml={3}>{this.multipleTasksLabel(tasks)}</Text>
              : null
            }
            <TouchableWithoutFeedback
              // We need to disable TouchableWithoutFeedback when keyboard is not visible,
              // otherwise the ScrollView for proofs of delivery is not scrollable
              disabled={ !this.state.isKeyboardVisible }
              // This allows hiding the keyboard when touching anything on the screen
              onPress={ Keyboard.dismiss }>
              <VStack>
                { this.isDropoff() && (
                  <React.Fragment>
                    <HStack justifyContent="space-between" alignItems="center" p="3">
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Icon as={ FontAwesome } name="user" style={{ marginRight: 10 }} />
                        <Text numberOfLines={ 1 }>{ contactName }</Text>
                      </View>
                      <TouchableOpacity onPress={ () => this.setState({ isContactNameModalVisible: true }) }>
                        <Text>{ this.props.t('EDIT') }</Text>
                      </TouchableOpacity>
                    </HStack>
                    <Divider />
                  </React.Fragment>
                ) }
                {!success && <FormControl p="3">
                  <FormControl.Label>{this.props.t('FAILURE_REASON')}</FormControl.Label>
                  <FailureReasonPicker
                    task={task}
                    httpClient={this.props.httpClient}
                    onValueChange={failureReason => this.setState({ failureReason })} />
                </FormControl>}
                <FormControl p="3">
                  <FormControl.Label>{ this.props.t('NOTES') }</FormControl.Label>
                  <TextArea
                    autoCorrect={ false }
                    totalLines={ 2 }
                    onChangeText={ text => this.setState({ notes: text }) } />
                </FormControl>
                <View>
                  <ScrollView style={{ height: '50%' }}>
                    <View style={ styles.content }>
                      <View style={ styles.imagesContainer }>
                      { this.props.signatures.map((base64, key) => (
                        <AttachmentItem
                          key={ `signatures:${key}` }
                          base64={ base64 }
                          onPressDelete={ () => this.props.deleteSignatureAt(key) } />
                      ))}
                      { this.props.pictures.map((base64, key) => (
                        <AttachmentItem
                          key={ `pictures:${key}` }
                          base64={ base64 }
                          onPressDelete={ () => this.props.deletePictureAt(key) } />
                      ))}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </VStack>
            </TouchableWithoutFeedback>
          </VStack>
          <Divider />
          <VStack>
            <TouchableOpacity
              onPress={ () => this.props.navigation.navigate('TaskCompleteProofOfDelivery', { task, tasks }) }>
              <HStack alignItems="center" justifyContent="space-between" p="3">
                <Icon as={ FontAwesome5 } name="signature" />
                <Text>
                  { this.props.t('TASK_ADD_PROOF_OF_DELIVERY') }
                </Text>
                <Icon as={ FontAwesome5 } name="camera" />
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={ onPress } style={{ alignItems: 'center', backgroundColor: footerBgColor }}>
              <HStack py="3" alignItems="center">
                <Icon as={ FontAwesome } name={ buttonIconName } style={{ color: '#fff', marginRight: 10 }} />
                <Text>{ footerText }</Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </KeyboardAvoidingView>
        <Modal
          isVisible={ this.state.isContactNameModalVisible }
          onSwipeComplete={ this.onSwipeComplete.bind(this) }
          swipeDirection={ [ 'up', 'down' ] }>
          <ModalContent>
            <Box p="3">
              <Formik
                initialValues={ initialValues }
                validate={ this._validate.bind(this) }
                onSubmit={ this._onSubmit.bind(this) }
                validateOnBlur={ false }
                validateOnChange={ false }>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <FormControl error={ (touched.contactName && errors.contactName) } style={{ marginBottom: 15 }}>
                    <FormControl.Label>{ this.props.t('DELIVERY_DETAILS_RECIPIENT') }</FormControl.Label>
                    <Input
                      autoCorrect={ false }
                      autoCapitalize="none"
                      autoCompleteType="off"
                      style={{ height: 40 }}
                      returnKeyType="done"
                      onChangeText={ handleChange('contactName') }
                      onBlur={ handleBlur('contactName') }
                      defaultValue={ values.contactName } />
                  </FormControl>
                  <Button block onPress={ handleSubmit }>
                    { this.props.t('SUBMIT') }
                  </Button>
                </View>
                )}
              </Formik>
            </Box>
          </ModalContent>
        </Modal>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: (CONTENT_PADDING + (CONTENT_PADDING - (DELETE_ICON_SIZE / 2))),
    paddingRight: (CONTENT_PADDING + (CONTENT_PADDING - (DELETE_ICON_SIZE / 2))),
    paddingBottom: CONTENT_PADDING,
    paddingLeft: CONTENT_PADDING,
  },
  imagesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  image: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  imageDelBtn: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    top: -16,
    right: -16,
  },
})

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    taskCompleteError: selectIsTaskCompleteFailure(state),
    signatures: selectSignatures(state),
    pictures: selectPictures(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    markTaskFailed: (client, task, notes, reason, onSuccess, contactName) => dispatch(markTaskFailed(client, task, notes, reason, onSuccess, contactName)),
    markTaskDone: (client, task, notes, onSuccess, contactName) => dispatch(markTaskDone(client, task, notes, onSuccess, contactName)),
    markTasksDone: (client, tasks, notes, onSuccess, contactName) => dispatch(markTasksDone(client, tasks, notes, onSuccess, contactName)),
    deleteSignatureAt: index => dispatch(deleteSignatureAt(index)),
    deletePictureAt: index => dispatch(deletePictureAt(index)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CompleteTask))
