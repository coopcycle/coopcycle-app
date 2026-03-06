import { Button, ButtonText, ButtonIcon} from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Image as ImageIcon, Zap, ZapOff, Camera as CameraIcon, FolderSearch } from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { Camera, useCameraDevice, useCameraPermission, useLocationPermission } from 'react-native-vision-camera';

import { addPicture } from '../../redux/Courier';
import { navigateBackToCompleteTask } from '@/src/navigation/utils';

function Photo({ navigation, route, addPicture }) {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [canMountCamera, setCanMountCamera] = useState(false);
  const [flash, setFlash] = useState(false);

  const camera = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: hasLocationPermission, requestPermission: requestLocationPermission } = useLocationPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    requestPermission();
    requestLocationPermission();
  }, [requestPermission, requestLocationPermission]);

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => setCanMountCamera(true));
    const unsubBlur = navigation.addListener('blur', () => setCanMountCamera(false));
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  const saveImage = () => {
    const task = route.params?.task;
    if (image) {
      addPicture(task, image);
      navigateBackToCompleteTask(navigation, route);
    }
  };

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        flash: flash ? 'on' : 'off',
      });
      const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      setImage(uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const file = new File(result.assets[0].uri);

      if (file.exists) {
        const task = route.params?.task;
        addPicture(task, file.uri);
        navigateBackToCompleteTask(navigation, route);
      }
    }
  };

  const { width } = Dimensions.get('window');
  const previewSize = width / 3 - 15;
  const canShowCamera = canMountCamera && hasPermission && device != null;

  return (
    <VStack flex={1}>
      <VStack flex={1} className="p-3">
        <HStack className="justify-between items-center mb-5 pt-3">
          <Text className="text-md">
            {t('PHOTO_DISCLAIMER')}
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
          {canShowCamera ? (
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true}
              enableLocation={true}
            />
          ) : null}
          <Button
            onPress={() => setFlash(f => !f)}
            variant="solid"
            colorScheme="yellow"
            style={styles.flash}
          >
            <ButtonIcon as={flash ? Zap : ZapOff} />
          </Button>
          <Button
            onPress={takePicture}
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
                source={{ uri: image }}
              />
            )}
          </View>
        </Box>
      </VStack>
      <VStack className="p-2">
        <Button size="lg" onPress={saveImage}>
          <ButtonText>{t('PHOTO_ADD')}</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
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
    addPicture: (task, uri) => dispatch(addPicture(task, uri)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Photo);
