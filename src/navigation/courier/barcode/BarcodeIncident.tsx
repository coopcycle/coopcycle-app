import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Dimensions, Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { SkeletonText } from '@/components/ui/skeleton';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { Camera as CameraIcon, CircleX } from 'lucide-react-native';
import { connect } from 'react-redux';
import { useQuery } from 'react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraView } from 'expo-camera';
import { addPicture, reportIncident } from '../../../redux/Courier/taskActions';
import { selectHttpClient } from '../../../redux/App/selectors';

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
  }, [enableCamera, navigation]);

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
        size="lg"
        className="mb-2"
        onPress={() => setFailureReason(value.code)}>
        <ButtonText>{value.description}</ButtonText>
      </Button>
    ));
  }, [data, isSuccess]);

  if (isError) {
    return (
      <Text className="p-4 text-error-500">
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
          <View style={{ position: 'absolute', bottom: 0, width, alignItems: 'center' }}>
            <Button size="lg" className="rounded-full p-3.5 w-1/4" onPress={_takePicture}>
              <ButtonIcon as={CameraIcon} />
            </Button>
          </View>
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
          <VStack className="p-4" space="md">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>{t('FAILURE_REASON')}</FormControlLabelText>
              </FormControlLabel>
              <Button
                variant="outline"
                colorScheme="dark"
                onPress={() => {
                  setFailureReason(null);
                  setNotes(null);
                }}>
                <ButtonText>
                  {
                    data['hydra:member'].find(
                      r => r.code === selectedFailureReason,
                    ).description
                  }
                </ButtonText>
              </Button>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>{t('NOTES')}</FormControlLabelText>
              </FormControlLabel>
              <Textarea>
                <TextareaInput
                  value={notes}
                  onChangeText={setNotes}
                />
              </Textarea>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>{t('PICTURES')}</FormControlLabelText>
              </FormControlLabel>
              <Button
                onPress={() => setEnableCamera(true)}>
                <ButtonIcon as={CameraIcon} />
                <ButtonText>{t('PHOTO_DISCLAIMER')}</ButtonText>
              </Button>
            </FormControl>
            <View style={{ flexDirection:"row", flexWrap: "wrap", justifyContent: "space-around" }}>
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
                  <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }} onPress={() =>
                      setPictures(pictures.filter((_p, i) => i !== index))
                    }>
                    <Icon as={CircleX} size={ 40 } />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </VStack>
        </ScrollView>
        <View p="4">
          <Button
            onPress={() => {
              pictures.forEach(picture => addPicture(picture));
              reportIncident(entity.id, notes, selectedFailureReason, () =>
                navigation.popToTop(),
              );
            }}>
            <ButtonText>{t('SUBMIT')}</ButtonText>
          </Button>
        </View>
      </>
    );
  }
  // END

  // PICKER MODE
  return (
    <ScrollView>
      <SkeletonText className="h-3" _lines={8} isLoaded={isSuccess}>
        <VStack className="p-4">
          {values}
        </VStack>
      </SkeletonText>
    </ScrollView>
  );
  // END
}

function mapStateToProps(state) {
  return {
    httpClient: selectHttpClient(state),
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
          [],
          onSuccess,
        ),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BarcodeIncident));
