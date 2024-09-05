import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { withTranslation } from 'react-i18next';
import {
  Button,
  VStack,
  Text,
  Skeleton,
  ScrollView,
  HStack,
  IconButton,
  Icon,
  TextArea,
  View,
  Image,
  FormControl,
  Stack,
  Flex,
} from 'native-base';
import { connect } from 'react-redux';
import { useQuery } from 'react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraView } from 'expo-camera/next';
import { addPicture, reportIncident } from '../../../redux/Courier/taskActions';

function BarcodeIncident({
  route,
  t,
  navigation,
  httpClient,
  addPicture,
  reportIncident,
}) {
  const { entity } = route.params;

  const [selectedFailureReason, setFailureReason] = useState(null);
  const [notes, setNotes] = useState(null);
  const [enableCamera, setEnableCamera] = useState(false);
  const camera = useRef(null);
  const [pictures, setPictures] = useState([]);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    navigation.setOptions({ headerShown: !enableCamera });
  }, [enableCamera]);

  const { data, isSuccess, isError } = useQuery(
    ['task', 'failure_reasons', entity.id],
    async () => {
      return await httpClient.get(`/api/tasks/${entity.id}/failure_reasons`);
    },
  );

  const values = useMemo(() => {
    if (!isSuccess || !data) {
      return null;
    }
    return data['hydra:member'].map((value, index) => (
      <Button
        key={index}
        colorScheme="dark"
        size="lg"
        onPress={() => setFailureReason(value.code)}>
        {value.description}
      </Button>
    ));
  }, [data, isSuccess]);

  if (isError) {
    return (
      <Text p="4" color="red.500">
        Failure reasons are not available
      </Text>
    );
  }

  // CAMERA VIEW MODE
  if (enableCamera) {
    const _takePicture = async () => {
      const options = { quality: 0.35, base64: true };
      const pictureOpts = await camera.current.takePictureAsync(options);
      setPictures([...pictures, pictureOpts.uri]);
      setEnableCamera(false);
    };
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <CameraView ref={camera} style={{ flex: 1 }}>
          <IconButton
            my="2"
            style={{ position: 'absolute', bottom: 0, width }}
            icon={
              <Icon
                as={Ionicons}
                color={'red.500'}
                size="16"
                name="disc-sharp"
              />
            }
            onPress={_takePicture}
          />
        </CameraView>
      </View>
    );
  }
  // END

  // DETAILS MODE
  if (selectedFailureReason) {
    return (
      <>
        <ScrollView>
          <Stack p="4" space={2}>
            <FormControl>
              <FormControl.Label>{t('FAILURE_REASON')}</FormControl.Label>
              <Button
                variant="outline"
                colorScheme="dark"
                onPress={() => {
                  setFailureReason(null);
                  setNotes(null);
                }}>
                {
                  data['hydra:member'].find(
                    r => r.code === selectedFailureReason,
                  ).description
                }
              </Button>
            </FormControl>
            <FormControl>
              <FormControl.Label>{t('NOTES')}</FormControl.Label>
              <TextArea value={notes} onChangeText={setNotes} />
            </FormControl>
            <FormControl>
              <FormControl.Label>{t('PICTURES')}</FormControl.Label>
              <Button
                onPress={() => setEnableCamera(true)}
                colorScheme="dark"
                leftIcon={<Icon as={Ionicons} name="camera" />}>
                {t('PHOTO_DISCLAIMER')}
              </Button>
            </FormControl>
            <Flex direction="row" flexWrap="wrap" justifyContent="space-around">
              {pictures.map((picture, index) => (
                <View
                  key={index}
                  style={{ width: width * 0.4, height: width * 0.4 }}
                  py="2">
                  <Image
                    style={{ flex: 1, borderRadius: 5 }}
                    source={{ uri: picture }}
                    alt="picture"
                  />
                  <IconButton
                    style={{ position: 'absolute', top: 5, right: 5 }}
                    icon={<Icon as={Ionicons} name="close" />}
                    onPress={() =>
                      setPictures(pictures.filter((_p, i) => i !== index))
                    }
                  />
                </View>
              ))}
            </Flex>
          </Stack>
        </ScrollView>
        <View p="4">
          <Button
            onPress={() => {
              pictures.forEach(picture => addPicture(picture));
              reportIncident(entity.id, notes, selectedFailureReason, () =>
                navigation.popToTop(),
              );
            }}>
            {t('SUBMIT')}
          </Button>
        </View>
      </>
    );
  }
  // END

  // PICKER MODE
  return (
    <ScrollView>
      <Skeleton p="4" isLoaded={isSuccess}>
        <VStack p="4" space={2}>
          {values}
        </VStack>
      </Skeleton>
    </ScrollView>
  );
  // END
}

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addPicture: base64 => dispatch(addPicture(null, base64)),
    reportIncident: (task_id, notes, failureReasonCode, onSuccess) =>
      dispatch(
        reportIncident(
          { '@id': `/api/tasks/${task_id}` },
          notes ?? '',
          failureReasonCode,
          onSuccess,
        ),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BarcodeIncident));
