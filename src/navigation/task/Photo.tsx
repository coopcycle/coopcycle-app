import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
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
import * as LegacyFS from 'expo-file-system/legacy';
import { v4 as uuid } from 'uuid';
import { Camera, useCameraDevice, useCameraPermission, useLocationPermission } from 'react-native-vision-camera';

import { addPicture } from '../../redux/Courier';
import { navigateBackToCompleteTask } from '@/src/navigation/utils';
import { compressImage } from '../../utils/imageCompression';

function Photo({ navigation, route, addPicture }) {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [canMountCamera, setCanMountCamera] = useState(false);
  const [flash, setFlash] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const saveImage = async () => {
    const task = route.params?.task;
    if (!image || isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      const compressed = await compressImage(image);
      const destDir = `${LegacyFS.documentDirectory}pending_uploads/`;
      await LegacyFS.makeDirectoryAsync(destDir, { intermediates: true });
      const destUri = `${destDir}${uuid()}.jpg`;
      await LegacyFS.copyAsync({ from: compressed, to: destUri });
      addPicture(task, destUri);
      navigateBackToCompleteTask(navigation, route);
    } catch (e) {
      console.error('saveImage failed:', e);
      setIsSaving(false);
    }
  };

  const takePicture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          flash: flash ? 'on' : 'off',
        });
        const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
        setImage(uri);
      } catch (e) {
        console.error('takePicture failed:', e);
      }
    }
  };

  const pickImage = async () => {
    if (isSaving) {
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Only show the busy state once we start processing the picked image,
        // not while the OS picker is open.
        setIsSaving(true);
        const task = route.params?.task;
        const compressed = await compressImage(result.assets[0].uri);
        addPicture(task, compressed);
        navigateBackToCompleteTask(navigation, route);
      }
    } catch (e) {
      console.error('pickImage failed:', e);
      setIsSaving(false);
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
            className="absolute top-4 left-4 bg-warning-400"
          >
            <ButtonIcon as={flash ? Zap : ZapOff} />
          </Button>
          <Button
            onPress={takePicture}
            size="lg"
            variant="solid"
            className="absolute bottom-4"
            style={styles.cameraButton}
          >
            <ButtonIcon size={32} as={CameraIcon} />
          </Button>
          <View
            className="absolute top-4 right-4 bg-background-200 border border-outline-800"
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
        <Button size="lg" onPress={saveImage} isDisabled={isSaving}>
          {isSaving && <ButtonSpinner className="mr-2" />}
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
  },
  cameraButton: {
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
