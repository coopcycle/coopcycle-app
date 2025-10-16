import { Camera, CameraView } from 'expo-camera';
import { Button, ButtonText, ButtonIcon} from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Image as ImageIcon, Zap, ZapOff, Camera as CameraIcon, Folder } from 'lucide-react-native';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Modal from 'react-native-modal';

import { addPicture } from '../../redux/Courier';

import Photos from './components/Photos';

class Photo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      canStartCamera: false,
      canMountCamera: false,
      flash: false,
      photos: [],
      isPhotosModalVisible: false,
    };

    this.camera = React.createRef();
  }

  componentDidMount() {
    this.unsubscribeFromFocusListener = this.props.navigation.addListener(
      'focus',
      () => {
        this.setState({ canMountCamera: true });
      },
    );
    this.unsubscribeFromBlurListener = this.props.navigation.addListener(
      'blur',
      () => {
        this.setState({ canMountCamera: false });
      },
    );
    Camera.requestCameraPermissionsAsync().then(permissionResponse => {
      if (permissionResponse.granted) {
        this.setState({ canStartCamera: true });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromFocusListener();
    this.unsubscribeFromBlurListener();
  }

  _saveImage() {
    const task = this.props.route.params?.task;
    const tasks = this.props.route.params?.tasks;
    const { image } = this.state;
    if (image) {
      this.props.addPicture(task, image.uri);
      this.props.navigation.navigate({
        name: 'TaskCompleteHome',
        params: { task, tasks },
        merge: true,
      });
    }
  }

  _takePicture() {
    if (this.camera.current) {
      const options = { quality: 0.5, base64: false, imageType: 'jpg' };
      this.camera.current.takePictureAsync(options).then(data => {
        this.setState({ image: data });
      });
    }
  }

  _loadPhotos() {
    CameraRoll.getPhotos({
       first: 20,
       assetType: 'All',
    })
    .then(r => {
      this.setState({
        photos: r.edges,
        isPhotosModalVisible: true
      })
    })
    .catch((err) => {
        // Error Loading Images
    });
  }

  toggleFlash() {
    this.setState({ flash: !this.state.flash });
  }

  render() {
    const { width } = Dimensions.get('window');
    const previewSize = width / 3 - 15;
    const { image } = this.state;

    return (
      <VStack flex={1}>
        <VStack flex={1} className="p-3">
          <HStack className="justify-between items-center mb-3">
            <Text className="text-lg">
              {this.props.t('PHOTO_DISCLAIMER')}
            </Text>
            <Button
              onPress={this._loadPhotos.bind(this)}
              size={32}
              variant="link"
            >
              <ButtonIcon as={Folder} />
            </Button>
          </HStack>
          <Box className="border-2 border-outline-600 flex-1 justify-end overflow-hidden items-center pb-4">
            {/*
            // Only one Camera preview can be active at any given time.
            // If you have multiple screens in your app, you should unmount Camera components whenever a screen is unfocused.
            */}
            {this.state.canMountCamera && this.state.canStartCamera ? (
              <CameraView
                ref={this.camera}
                style={styles.camera}
                flashMode={this.state.flash ? 'on' : 'off'}>
              </CameraView>
            ) : null}
            <Button
              onPress={this.toggleFlash.bind(this)}
              variant="solid"
              colorScheme="yellow"
              style={styles.flash}
            >
              <ButtonIcon as={this.state.flash ? Zap : ZapOff} />
            </Button>
            <HStack>
              <Button
                onPress={this._takePicture.bind(this)}
                size="lg"
                variant="solid"
                className="mr-2 rounded-full p-4"
              >
                <ButtonIcon size={24} as={CameraIcon} />
              </Button>
            </HStack>
            <View
              style={[
                styles.preview,
                { width: previewSize, height: previewSize },
              ]}>
              {!image && <Icon as={ImageIcon} size="xl" className="text-color-light" />}
              {image && (
                <Image
                  style={{ width: previewSize, height: previewSize }}
                  source={{ uri: image.uri }}
                />
              )}
            </View>
          </Box>
        </VStack>
        <VStack className="p-2">
          <Button size="lg" onPress={this._saveImage.bind(this)}>
            <ButtonText>{this.props.t('PHOTO_ADD')}</ButtonText>
          </Button>
        </VStack>
        <Modal
          isVisible={this.state.isPhotosModalVisible}
          onSwipeComplete={() => console.log('swipeComplete')}
          onBackdropPress={() => console.log('onBackdropPress')}>
          <Photos photos={ this.state.photos }
            onPressClose={ () => {
              this.setState({
                isPhotosModalVisible: false
              })
            }}
            onSelectPhoto={ (base64) => {

              this.setState({
                isPhotosModalVisible: false
              })

              const task = this.props.route.params?.task;
              const tasks = this.props.route.params?.tasks;

              this.props.addPicture(task, base64);

              this.props.navigation.navigate({
                name: 'TaskCompleteHome',
                params: { task, tasks },
                merge: true,
              });


            }} />
        </Modal>
      </VStack>
    );
  }
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    flexDirection: 'row',
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
  },
});

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    addPicture: (task, base64) => dispatch(addPicture(task, base64)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Photo));
