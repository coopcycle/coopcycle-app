import React, { Component } from 'react'
import { Dimensions, Image, Keyboard, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import {
  Box, Button,
  Divider, FormControl, HStack, Icon, Input, KeyboardAvoidingView, ScrollView, Text, TextArea, VStack,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import Modal from 'react-native-modal'
import { Formik } from 'formik'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { WebView } from 'react-native-webview'

import {
  deletePictureAt,
  deleteSignatureAt,
  markTaskDone,
  markTaskFailed,
  selectIsTaskCompleteFailure,
  selectPictures,
  selectSignatures } from '../../redux/Courier'
import { greenColor, redColor } from '../../styles/common'
import { doneIconName, failedIconName } from './styles/common'
import ModalContent from '../../components/ModalContent'

const DELETE_ICON_SIZE = 32
const CONTENT_PADDING = 20

const AttachmentItem = ({ base64, onPressDelete }) => {

  const { width } = Dimensions.get('window')

  const imageSize = (width - 64) / 2

  if (!base64.startsWith('data:image/jpeg;base64')) {
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

const impecHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>IMPEC demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
  </head>
  <body>
    <button type="button" class="btn btn-primary" id="myBtn">Click here</button>
    <script>
      document.getElementById('myBtn').addEventListener('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ data: { message: 'IT WORKS' } }))
      });
    </script>
  </body>
</html>
`

class CompleteTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notes: '',
      isContactNameModalVisible: false,
      contactName: '',
      isKeyboardVisible: false,
      isImpecModalVisible: false,
    }
  }

  markTaskDone() {

    const task = this.props.route.params?.task
    const { notes } = this.state

    this.props.markTaskDone(this.props.httpClient, task, notes, () => {
      // Make sure to use merge = true, so that it doesn't break
      // when navigating to DispatchTaskList
      this.props.navigation.navigate({ name: this.props.route.params?.navigateAfter, merge: true })
    }, this.state.contactName)
  }

  markTaskFailed() {

    const task = this.props.route.params?.task
    const { notes } = this.state

    this.props.markTaskFailed(this.props.httpClient, task, notes, () => {
      // Make sure to use merge = true, so that it doesn't break
      // when navigating to DispatchTaskList
      this.props.navigation.navigate({ name: this.props.route.params?.navigateAfter, merge: true })
    }, this.state.contactName)
  }

  onSwipeComplete() {
    this.setState({ isContactNameModalVisible: false })
  }

  onImpectSwipeComplete() {
    this.setState({ isImpecModalVisible: false })
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
    const task = this.props.route.params?.task

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

  render() {

    const task = this.props.route.params?.task
    const success = Object.prototype.hasOwnProperty.call(this.props.route.params || {}, 'success') ?
      this.props.route.params?.success : true


    const buttonIconName = success ? doneIconName : failedIconName
    const footerBgColor = success ? greenColor : redColor
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
            <TouchableWithoutFeedback
              // We need to disable TouchableWithoutFeedback when keyboard is not visible,
              // otherwise the ScrollView for proofs of delivery is not scrollable
              disabled={ !this.state.isKeyboardVisible }
              // This allows hiding the keyboard when touching anything on the screen
              onPress={ Keyboard.dismiss }>
              <VStack>
                { task.type === 'DROPOFF' && (
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
                <FormControl p="3">
                  <FormControl.Label>{ this.props.t('NOTES') }</FormControl.Label>
                  <TextArea
                    autoCorrect={ false }
                    totalLines={ 2 }
                    onChangeText={ text => this.setState({ notes: text }) } />
                </FormControl>
                <Button onPress={ () => this.setState({ isImpecModalVisible: true }) }>
                  TEST IMPEC
                </Button>
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
              onPress={ () => this.props.navigation.navigate('TaskCompleteProofOfDelivery', { task }) }>
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
        <Modal
          isVisible={ this.state.isImpecModalVisible }
          onSwipeComplete={ this.onImpectSwipeComplete.bind(this) }
          swipeDirection={ [ 'up', 'down' ] }
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}>
          <VStack px="3" py="3" bg="white" style={{ height: 300 }}>
            <WebView
              bounces={false}
              style={{
                width: '100%',
                height: 250,
                borderWidth: 1,
                borderColor: 'red'
              }}
              scrollEnabled={ true }
              originWhitelist={['*']}
              source={{
                html: impecHtml
              }}
              onMessage={(event) => {
                this.setState({ isImpecModalVisible: false })
                alert(event.nativeEvent.data);
              }}
              javaScriptEnabled={true}
            />
          </VStack>
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
    markTaskFailed: (client, task, notes, onSuccess, contactName) => dispatch(markTaskFailed(client, task, notes, onSuccess, contactName)),
    markTaskDone: (client, task, notes, onSuccess, contactName) => dispatch(markTaskDone(client, task, notes, onSuccess, contactName)),
    deleteSignatureAt: index => dispatch(deleteSignatureAt(index)),
    deletePictureAt: index => dispatch(deletePictureAt(index)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CompleteTask))
