import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import {
  Container, Content,
  Icon, Text, Footer,
  Label, Button, Form, Item, Input,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import Modal from 'react-native-modal'
import { Formik } from 'formik'

import {
  selectIsTaskCompleteFailure,
  selectSignatureScreenFirst,
  selectSignatures,
  selectPictures,
  deleteSignatureAt,
  deletePictureAt,
  markTaskDone,
  markTaskFailed } from '../../redux/Courier'
import { greenColor, redColor } from '../../styles/common'
import { doneIconName, failedIconName} from './styles/common'

const DELETE_ICON_SIZE = 32
const CONTENT_PADDING = 20

class CompleteTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notes: '',
      isContactNameModalVisible: false,
      contactName: '',
    }
  }

  markTaskDone() {

    const task = this.props.navigation.getParam('task')
    const { notes } = this.state

    this.props.markTaskDone(this.props.httpClient, task, notes, () => {
      this.props.navigation.navigate(this.props.navigation.getParam('navigateAfter'))
    }, this.state.contactName)
  }

  markTaskFailed() {

    const task = this.props.navigation.getParam('task')
    const { notes } = this.state

    this.props.markTaskFailed(this.props.httpClient, task, notes, () => {
      this.props.navigation.navigate(this.props.navigation.getParam('navigateAfter'))
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
    const task = this.props.navigation.getParam('task')

    if (!_.isEmpty(this.state.contactName)) {
      return this.state.contactName
    }

    return !_.isEmpty(task.address.contactName) ? task.address.contactName : ''
  }

  render() {

    const task = this.props.navigation.getParam('task')
    const success = this.props.navigation.getParam('success', true)
    const { signatureScreenFirst } = this.props

    const { width } = Dimensions.get('window')

    const imageSize = (width - 64) / 2
    const buttonIconName = success ? doneIconName : failedIconName
    const footerBgColor = success ? greenColor : redColor
    const footerText = success ? this.props.t('VALIDATE') : this.props.t('MARK_FAILED')
    const onPress = success ? this.markTaskDone.bind(this) : this.markTaskFailed.bind(this)

    const contactName = this.resolveContactName()

    const initialValues = {
      contactName,
    }

    return (
      <Container>
        { task.type === 'DROPOFF' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Icon name="person" style={{ marginRight: 10 }} />
              <Text numberOfLines={ 1 }>{ contactName }</Text>
            </View>
            <TouchableOpacity onPress={ () => this.setState({ isContactNameModalVisible: true }) }>
              <Text>{ this.props.t('EDIT') }</Text>
            </TouchableOpacity>
          </View>
        ) }
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Label style={{ marginBottom: 5 }}>{ this.props.t('NOTES') }</Label>
          <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 16 }}>
            <TextInput multiline={ true } numberOfLines={ 3 }
              onChangeText={ text => this.setState({ notes: text }) } />
          </View>
        </View>
        <Content contentContainerStyle={ styles.content }>
          <View style={ styles.imagesContainer }>
          { this.props.signatures.map((base64, key) => (
            <View key={ `signatures:${key}` }
              style={ [ styles.image, { width: imageSize, height: imageSize }] }>
              <Image
                source={{ uri: `data:image/jpeg;base64,${base64}` }}
                style={{ width: (imageSize - 2), height: (imageSize - 2) }} />
              <TouchableOpacity
                style={ styles.imageDelBtn }
                onPress={ () => this.props.deleteSignatureAt(key) }>
                <Icon type="FontAwesome5" name="times-circle" />
              </TouchableOpacity>
            </View>
          ))}
          { this.props.pictures.map((base64, key) => (
            <View key={ `pictures:${key}` }
              style={ [ styles.image, { width: imageSize, height: imageSize }] }>
              <Image
                source={{ uri: `data:image/jpeg;base64,${base64}` }}
                style={{ width: (imageSize - 2), height: (imageSize - 2) }} />
              <TouchableOpacity
                style={ styles.imageDelBtn }
                onPress={ () => this.props.deletePictureAt(key) }>
                <Icon type="FontAwesome5" name="times-circle" />
              </TouchableOpacity>
            </View>
          ))}
          </View>
        </Content>
        <TouchableOpacity
          style={ styles.addPoDButton }
          onPress={ () => this.props.navigation.navigate('TaskCompleteProofOfDelivery', { task, signatureScreenFirst }) }>
          <Icon type="FontAwesome5" name="signature"
            style={ styles.addPoDButtonText } />
          <Text
            style={ [ styles.addPoDButtonText, { textAlign: 'center', marginHorizontal: 10 } ] }>
            { this.props.t('TASK_ADD_PROOF_OF_DELIVERY') }
          </Text>
          <Icon type="FontAwesome5" name="camera"
            style={ styles.addPoDButtonText } />
        </TouchableOpacity>
        <Footer style={{ alignItems: 'center', backgroundColor: footerBgColor }}>
          <TouchableOpacity style={ styles.buttonContainer } onPress={ onPress }>
            <View style={ styles.buttonTextContainer }>
              <Icon type="FontAwesome" name={ buttonIconName } style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{ footerText }</Text>
            </View>
          </TouchableOpacity>
        </Footer>
        <Modal
          isVisible={ this.state.isContactNameModalVisible }
          onSwipeComplete={ this.onSwipeComplete.bind(this) }
          swipeDirection={ ['up', 'down'] }>
          <View style={ styles.modalContent }>
            <Formik
              initialValues={ initialValues }
              validate={ this._validate.bind(this) }
              onSubmit={ this._onSubmit.bind(this) }
              validateOnBlur={ false }
              validateOnChange={ false }>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <Form>
                <Item stackedLabel error={ (touched.contactName && errors.contactName) } style={{ marginBottom: 15 }}>
                  <Label>{ this.props.t('DELIVERY_DETAILS_RECIPIENT') }</Label>
                  <Input
                    autoCorrect={ false }
                    autoCapitalize="none"
                    autoCompleteType="off"
                    style={{ height: 40 }}
                    returnKeyType="done"
                    onChangeText={ handleChange('contactName') }
                    onBlur={ handleBlur('contactName') }
                    defaultValue={ values.contactName } />
                </Item>
                <Button block onPress={ handleSubmit }>
                  <Text>{ this.props.t('SUBMIT') }</Text>
                </Button>
              </Form>
              )}
            </Formik>
          </View>
        </Modal>
      </Container>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  form: {
    flex: 1,
    marginBottom: 10,
  },
  addPoDButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    maxHeight: '15%',
  },
  addPoDButtonText: {
    color: '#0074D9',
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
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 15,
  },
})

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    taskCompleteError: selectIsTaskCompleteFailure(state),
    signatures: selectSignatures(state),
    pictures: selectPictures(state),
    signatureScreenFirst: selectSignatureScreenFirst(state),
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CompleteTask))
