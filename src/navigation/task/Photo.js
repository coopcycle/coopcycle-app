import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import {
  Button, Icon, Text, VStack, IconButton,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Camera, CameraType } from 'expo-camera'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { addPicture } from '../../redux/Courier'

class Photo extends Component {

  constructor(props) {
    super(props)

    this.state = {
      image: null,
      canStartCamera: false,
      canMountCamera: false,
      flash: false,
    }

    this.camera = React.createRef()
  }

  componentDidMount() {
    this.unsubscribeFromFocusListener = this.props.navigation.addListener(
      'focus',
      () => {
        this.setState({ canMountCamera: true })
      }
    )
    this.unsubscribeFromBlurListener = this.props.navigation.addListener(
      'blur',
      () => {
        this.setState({ canMountCamera: false })
      }
    )
    Camera.requestCameraPermissionsAsync()
      .then((permissionResponse) => {
        if (permissionResponse.granted) {
          this.setState({ canStartCamera: true })
        }
      })
  }

  componentWillUnmount() {
    this.unsubscribeFromFocusListener()
    this.unsubscribeFromBlurListener()
  }

  _saveImage() {
    const task = this.props.route.params?.task
    const tasks = this.props.route.params?.tasks
    const { image } = this.state
    if (image) {
      this.props.addPicture(task, image.uri)
      this.props.navigation.navigate({ name: 'TaskCompleteHome', params: { task, tasks }, merge: true })
    }
  }

  _takePicture() {
    if (this.camera.current) {
      const options = { quality: 0.5, base64: false };
      this.camera.current.takePictureAsync(options).then(data => {
        this.setState({ image: data })
      })
    }
  }

  toggleFlash() {
    this.setState({ flash: !this.state.flash })
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
            {/*
            // Only one Camera preview can be active at any given time.
            // If you have multiple screens in your app, you should unmount Camera components whenever a screen is unfocused.
            */}
            { (this.state.canMountCamera && this.state.canStartCamera) ? (
            <Camera
              ref={ this.camera }
              style={ styles.camera }
              flashMode={ this.state.flash ? 'on' : 'off' }>
              <IconButton onPress={ this.toggleFlash.bind(this) } variant="ghost" colorScheme="yellow" _icon={{
                as: Ionicons,
                name: this.state.flash ? "flash" : "flash-off"
              }} style={ styles.flash } />
              <IconButton onPress={ this._takePicture.bind(this) } size="lg" variant="solid" _icon={{
                as: Ionicons,
                name: "camera"
              }} />
              <View style={ [ styles.preview, { width: previewSize, height: previewSize }] }>
                { !image && ( <Icon as={ AntDesign } name="picture" size="lg" /> ) }
                { image && ( <Image style={{ width: previewSize, height: previewSize }} source={{ uri: image.uri }} /> ) }
              </View>
              </Camera>
            ) : null }
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
  flash: {
    position: 'absolute',
    top: 15,
    left: 15,
  }
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
