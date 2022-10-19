import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import {
  Button, Icon, Text, VStack,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { RNCamera } from 'react-native-camera'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { addPicture } from '../../redux/Courier'

class Photo extends Component {

  constructor(props) {
    super(props)

    this.state = {
      image: null,
    }
  }

  _saveImage() {
    const task = this.props.route.params?.task
    const { image } = this.state
    if (image) {
      this.props.addPicture(task, image.base64)
      this.props.navigation.navigate({ name: 'TaskCompleteHome', params: { task }, merge: true })
    }
  }

  _takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      this.camera.takePictureAsync(options).then(data => {
        this.setState({ image: data })
      })
    }
  }

  render() {

    const { width } = Dimensions.get('window')
    const previewSize = (width / 3) - 15
    const { image } = this.state

    return (
      <VStack flex={ 1 }>
        <VStack flex={ 1 } p="2">
          <Text note style={{ textAlign: 'center', marginBottom: 20 }}>
            { this.props.t('PHOTO_DISCLAIMER') }
          </Text>
          <View style={ styles.canvasContainer }>
            <RNCamera
              ref={ (ref) => { this.camera = ref }}
              style={ styles.camera }
              type={ RNCamera.Constants.Type.back }
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              captureAudio={ false }>
              <Button style={ styles.takePictureBtn } light onPress={ this._takePicture.bind(this) }>
                <Icon as={ FontAwesome } name="camera" />
              </Button>
              <View style={ [ styles.preview, { width: previewSize, height: previewSize }] }>
                { !image && ( <Icon as={ FontAwesome } name="picture-o" size="sm" /> ) }
                { image && ( <Image style={{ width: previewSize, height: previewSize }} source={{ uri: image.uri }} /> ) }
              </View>
            </RNCamera>
          </View>
        </VStack>
        <VStack p="2">
          <Button size="lg" onPress={ this._saveImage.bind(this) }>
            { this.props.t('PHOTO_ADD') }
          </Button>
        </VStack>
      </VStack>
    )
  }
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#000000',
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  takePictureBtn: {
    flex: 0,
    alignSelf: 'center',
    padding: 20,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#000000',
    borderWidth: 1,
    position: 'absolute',
    top: 15,
    right: 15,
  },
})

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addPicture: (task, base64) => dispatch(addPicture(task, base64)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Photo))
