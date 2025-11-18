import { Camera, CameraView } from 'expo-camera';
import { Button, ButtonText, ButtonIcon} from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Image as ImageIcon, Zap, ZapOff, Camera as CameraIcon, FolderSearch } from 'lucide-react-native';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';

import { addPicture } from '../../redux/Courier';

class Photo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      canStartCamera: false,
      canMountCamera: false,
      flash: false,
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

  toggleFlash() {
    this.setState({ flash: !this.state.flash });
  }

  render() {
    const { width } = Dimensions.get('window');
    const previewSize = width / 3 - 15;
    const { image } = this.state;

    const pickImage = async () => {

      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {

        const file = new File(result.assets[0].uri);
        const base64 = await file.base64();

        const task = this.props.route.params?.task;
        const tasks = this.props.route.params?.tasks;

        this.props.addPicture(task, base64);

        this.props.navigation.navigate({
          name: 'TaskCompleteHome',
          params: { task, tasks },
          merge: true,
        });
      }
    };

    return (
      <VStack flex={1}>
        <VStack flex={1} className="p-3">
          <HStack className="justify-between items-center mb-5 pt-3">
            <Text className="text-md">
              {this.props.t('PHOTO_DISCLAIMER')}
            </Text>
            <Button
              onPress={pickImage}
              size={36}
              variant="link"
            >
              <ButtonIcon as={FolderSearch} />
            </Button>
          </HStack>
          <Box className="border-2 border-outline-600 flex-1 items-center">
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
            <Button
              onPress={this._takePicture.bind(this)}
              size="lg"
              variant="solid"
              style={styles.cameraButton}
            >
              <ButtonIcon size={32} as={CameraIcon} />
            </Button>
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
    width: "100%",
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
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  }
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
