import { Formik } from 'formik';
import _ from 'lodash';
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Input,
  ScrollView,
  Skeleton,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect, useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvoidSoftInput, useSoftInputHeightChanged } from 'react-native-avoid-softinput';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import qs from 'qs';

import { useQuery } from 'react-query';
import ModalContent from '../../components/ModalContent';
import { Picker } from '../../components/Picker';
import {
  deletePictureAt,
  deleteSignatureAt,
  markTaskDone,
  markTasksDone,
  selectPictures,
  selectSignatures,
} from '../../redux/Courier';
import { greenColor, yellowColor } from '../../styles/common';
import { doneIconName, incidentIconName } from './styles/common';
import { reportIncident } from '../../redux/Courier/taskActions';

const DELETE_ICON_SIZE = 32;
const CONTENT_PADDING = 20;

const AttachmentItem = ({ base64, onPressDelete }) => {
  const { width } = Dimensions.get('window');

  const imageSize = (width - 64) / 2;

  if (
    !base64.startsWith('file://') &&
    !base64.startsWith('data:image/jpeg;base64')
  ) {
    base64 = `data:image/jpeg;base64,${base64}`;
  }

  return (
    <View style={[styles.image, { width: imageSize, height: imageSize }]}>
      <Image
        source={{ uri: base64 }}
        style={{ width: imageSize - 2, height: imageSize - 2 }}
      />
      <TouchableOpacity style={styles.imageDelBtn} onPress={onPressDelete}>
        <Icon as={FontAwesome5} name="times-circle" />
      </TouchableOpacity>
    </View>
  );
};

const FailureReasonPicker = ({ task, httpClient, onValueChange }) => {
  const [selectedFailureReason, setFailureReason] = useState(null);

  const { data, isSuccess, isError } = useQuery(
    ['task', 'failure_reasons', task['@id']],
    async () => {
      return await httpClient.get(`${task['@id']}/failure_reasons`);
    },
  );

  const values = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    return data['hydra:member'].map((value, index) => (
      <Picker.Item key={index} value={value.code} label={value.description} />
    ));
  }, [data, isSuccess]);

  const onChange = (selectedFailureReason) => {
    if (!isSuccess) {
      return;
    }
    const failureReasonObj = _.find(data['hydra:member'], r => r.code === selectedFailureReason)
    onValueChange(selectedFailureReason, failureReasonObj);
    setFailureReason(selectedFailureReason)
  } 

  if (isError) {
    return <Text color="red.500">Failure reasons are not available</Text>;
  }

  return (
    <Skeleton isLoaded={isSuccess} rounded={2}>
      <Picker
        selectedValue={selectedFailureReason}
        onValueChange={v => onChange(v)}>
        <Picker.Item value={null} label="" />
        {values}
      </Picker>
    </Skeleton>
  );
};

function isDropoff(task, tasks) {
  if (tasks && tasks.length > 1) {
    return tasks.every(t => t.type === 'DROPOFF');
  } else if (tasks && tasks.length === 1) {
    return tasks[0].type === 'DROPOFF';
  }
  return task && task.type === 'DROPOFF';
}

const MultipleTasksLabel = ({ tasks }) => {

  const { t } = useTranslation();

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Text mt={2} ml={3}>
      {tasks.reduce(
        (label, task, idx) => {
          const taskIdentifier = task?.metadata?.order_number ? `${task.metadata.order_number}-${task?.metadata?.delivery_position}` : task.id
          return `${label}${idx !== 0 ? ',' : ''} #${taskIdentifier}`;
        },
        `${t('COMPLETE_TASKS')}: `,
      )}
    </Text>
  )
}

const ContactNameModal = ({ isVisible, onSwipeComplete, initialValues, onSubmit }) => {

  const { t } = useTranslation();

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={['up', 'down']}>
      <ModalContent>
        <Box p="3">
          <Formik
            initialValues={initialValues}
            validate={(values) => {
              if (_.isEmpty(values.contactName)) {
                return {
                  contactName: t('STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME'),
                };
              }

              return {};
            }}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <FormControl
                  error={touched.contactName && errors.contactName}
                  style={{ marginBottom: 15 }}>
                  <FormControl.Label>
                    {t('DELIVERY_DETAILS_RECIPIENT')}
                  </FormControl.Label>
                  <Input
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    style={{ height: 40 }}
                    returnKeyType="done"
                    onChangeText={handleChange('contactName')}
                    onBlur={handleBlur('contactName')}
                    defaultValue={values.contactName}
                  />
                </FormControl>
                <Button block onPress={handleSubmit}>
                  {t('SUBMIT')}
                </Button>
              </View>
            )}
          </Formik>
        </Box>
      </ModalContent>
    </Modal>
  )
}

function resolveContactName(contactName, task, tasks) {

  if (!_.isEmpty(contactName)) {
    return contactName;
  }

  if (!task && tasks && tasks.length > 0) {
    task = tasks[0];
  }

  return !_.isEmpty(task.address.contactName) ? task.address.contactName : '';
}

function isSuccessRoute(route) {

  return Object.prototype.hasOwnProperty.call(
    route.params || {},
    'success',
  )
    ? route.params?.success
    : true;
}

const SubmitButton = ({ task, tasks, notes, contactName, failureReason, validateTaskAfterReport, failureReasonMetadataToSend }) => {

  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const success = isSuccessRoute(route);

  const buttonIconName = success ? doneIconName : incidentIconName;
  const footerBgColor = success ? greenColor : yellowColor;

  const onPress = () => {

    const navigateOnSuccess = () => {
      // Make sure to use merge = true, so that it doesn't break
      // when navigating to DispatchTaskList
      navigation.navigate({
        name: route.params?.navigateAfter,
        merge: true,
      });
    }

    if (success) {
      if (tasks && tasks.length) {
        dispatch(markTasksDone(
          tasks,
          notes,
          navigateOnSuccess,
          contactName,
        ));
      } else {
        dispatch(markTaskDone(
          task,
          notes,
          navigateOnSuccess,
          contactName,
        ));
      }
    } else {
      dispatch(reportIncident(
        task,
        notes,
        failureReason,
        failureReasonMetadataToSend,
        () => {
          if (validateTaskAfterReport) {
            dispatch(markTaskDone(
              task,
              notes,
              navigateOnSuccess,
              contactName,
            ));
          } else {
            navigateOnSuccess();
          }
        },
      ));
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: 'center', backgroundColor: footerBgColor }}>
      <HStack py="3" alignItems="center">
        <Icon
          as={FontAwesome}
          name={buttonIconName}
          style={{ color: '#fff', marginRight: 10 }}
        />
        <Text>{success ? t('VALIDATE') : t('REPORT_INCIDENT')}</Text>
      </HStack>
    </TouchableOpacity>
  )
}

const parseInitialData = (data) => {
  const asQueryString = data.map(v => `${v.name}=${v.value}`).join('&')
  return qs.parse(asQueryString);
}

const FailureReasonForm = ({ data, onChange }) => {

  return (
    <Formik
      initialValues={ parseInitialData(data) }
      // We use validate as a change handler
      validate={ values => {
        onChange(values)
      }}
      validateOnBlur={ true }
      validateOnChange={ true }>
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        setFieldValue,
      }) =>
        <FlatList
          data={ _.filter(data, item => item.type !== 'hidden') }
          keyExtractor={ item => item.name }
          scrollEnabled={false}
          renderItem={({ item }) => {

            return (
              <FormControl mb="2" key={ item.name }>
                <FormControl.Label>{ item.label }</FormControl.Label>
                <Input
                  defaultValue={ item.value.toString() }
                  keyboardType={ item.type === 'number' ? 'number-pad' : 'default' }
                  onChangeText={ handleChange(item.name) }
                  onBlur={ handleBlur(item.name) } />
              </FormControl>
            )
          }}
        />
      }
    </Formik>
  )
}

const CompleteTask = ({
  httpClient,
  signatures,
  pictures,
  deleteSignatureAt,
  deletePictureAt,
}) => {

  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();

  const [notes, setNotes] = useState('');
  const [failureReason, setFailureReason] = useState(null);
  const [isContactNameModalVisible, setIsContactNameModalVisible] = useState(false);
  const [contactName, setContactName] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [validateTaskAfterReport, setValidateTaskAfterReport] = useState(false);

  const [failureReasonMetadata, setFailureReasonMetadata] = useState([]);
  const [failureReasonMetadataToSend, setFailureReasonMetadataToSend] = useState([]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const task = route.params?.task;
  const tasks = route.params?.tasks;
  const success = isSuccessRoute(route);

  const initialValues = {
    contactName: resolveContactName(contactName, task, tasks),
  };

  /* https://mateusz1913.github.io/react-native-avoid-softinput/docs/recipes/recipes-sticky-footer */

  const buttonContainerPaddingValue = useSharedValue(0);

  const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: buttonContainerPaddingValue.value,
    };
  });

  const onFocusEffect = React.useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);

    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);

  useFocusEffect(onFocusEffect);

  /**
   * You can also use `useSoftInputShown` & `useSoftInputHidden`
   *
   * useSoftInputShown(({ softInputHeight }) => {
   *   buttonContainerPaddingValue.value = withTiming(softInputHeight);
   * });
   *
   * useSoftInputHidden(() => {
   *   buttonContainerPaddingValue.value = withTiming(0);
   * });
   */
  useSoftInputHeightChanged(({ softInputHeight }) => {
    buttonContainerPaddingValue.value = withTiming(softInputHeight);
  });

  return (
    <React.Fragment>
      <SafeAreaView edges={[ 'left', 'right', 'bottom' ]} style={styles.screenContainer}>
        <View style={styles.scrollWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            contentInsetAdjustmentBehavior="always"
          >
            <VStack flex={1} w="100%">
              <MultipleTasksLabel tasks={ tasks } />
              <TouchableWithoutFeedback
                // We need to disable TouchableWithoutFeedback when keyboard is not visible,
                // otherwise the ScrollView for proofs of delivery is not scrollable
                disabled={!isKeyboardVisible}
                // This allows hiding the keyboard when touching anything on the screen
                onPress={Keyboard.dismiss}>
                <VStack>
                  {isDropoff(task, tasks) && (
                    <React.Fragment>
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        p="3">
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Icon
                            as={FontAwesome}
                            name="user"
                            style={{ marginRight: 10 }}
                          />
                          <Text numberOfLines={1}>{resolveContactName(contactName, task, tasks)}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            setIsContactNameModalVisible(true)
                          }>
                          <Text>{t('EDIT')}</Text>
                        </TouchableOpacity>
                      </HStack>
                      <Divider />
                    </React.Fragment>
                  )}
                  {!success && (
                    <FormControl p="3">
                      <FormControl.Label>
                        {t('FAILURE_REASON')}
                      </FormControl.Label>
                      <FailureReasonPicker
                        task={task}
                        httpClient={httpClient}
                        onValueChange={(code, obj) => {
                          if (obj && obj.metadata) {
                            setFailureReasonMetadata(obj.metadata);
                            setFailureReasonMetadataToSend(parseInitialData(obj.metadata));
                          } else {
                            setFailureReasonMetadata([]);
                            setFailureReasonMetadataToSend([]);
                          }
                          setFailureReason(code);
                        }}
                      />
                      { (Array.isArray(failureReasonMetadata) && failureReasonMetadata.length > 0) ?
                      <FailureReasonForm
                        data={ failureReasonMetadata }
                        onChange={ metadata => {
                          setFailureReasonMetadataToSend(metadata);
                        }} /> : null }
                    </FormControl>
                  )}
                  <FormControl p="3">
                    <FormControl.Label>{t('NOTES')}</FormControl.Label>
                    <TextArea
                      autoCorrect={false}
                      totalLines={2}
                      onChangeText={text => setNotes(text)}
                    />
                    {!success && (
                      <FormControl p="3">
                        <Button
                          bg={
                            validateTaskAfterReport
                              ? greenColor
                              : undefined
                          }
                          onPress={() =>
                            setValidateTaskAfterReport(!validateTaskAfterReport)
                          }
                          variant={
                            validateTaskAfterReport
                              ? 'solid'
                              : 'outline'
                          }
                          endIcon={
                            validateTaskAfterReport ? (
                              <Icon as={FontAwesome} name="check" size="sm" />
                            ) : undefined
                          }>
                          Validate the task after reporting
                        </Button>
                      </FormControl>
                    )}
                  </FormControl>
                  <View>
                    <ScrollView style={{ height: '50%' }}>
                      <View style={styles.content}>
                        <View style={styles.imagesContainer}>
                          {signatures.map((base64, key) => (
                            <AttachmentItem
                              key={`signatures:${key}`}
                              base64={base64}
                              onPressDelete={() =>
                                deleteSignatureAt(key)
                              }
                            />
                          ))}
                          {pictures.map((base64, key) => (
                            <AttachmentItem
                              key={`pictures:${key}`}
                              base64={base64}
                              onPressDelete={() =>
                                deletePictureAt(key)
                              }
                            />
                          ))}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </VStack>
              </TouchableWithoutFeedback>
            </VStack>
          </ScrollView>
        </View>
        <Animated.View style={[ buttonContainerAnimatedStyle, styles.ctaButtonWrapper ]}>
          <View style={styles.ctaButtonContainer}>
            <VStack w="100%">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TaskCompleteProofOfDelivery', {
                    task,
                    tasks,
                  })
                }>
                <HStack alignItems="center" justifyContent="space-between" p="3">
                  <Icon as={FontAwesome5} name="signature" />
                  <Text>{t('TASK_ADD_PROOF_OF_DELIVERY')}</Text>
                  <Icon as={FontAwesome5} name="camera" />
                </HStack>
              </TouchableOpacity>
              <SubmitButton
                task={task}
                tasks={tasks}
                notes={notes}
                contactName={contactName}
                failureReason={failureReason}
                validateTaskAfterReport={validateTaskAfterReport}
                failureReasonMetadataToSend={failureReasonMetadataToSend}
              />
            </VStack>
          </View>
        </Animated.View>
      </SafeAreaView>
      <ContactNameModal
        isVisible={isContactNameModalVisible}
        onSwipeComplete={() => setIsContactNameModalVisible(false)}
        initialValues={ initialValues }
        onSubmit={(values) => {
          setContactName(values.contactName);
          setIsContactNameModalVisible(false);
        }} />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: CONTENT_PADDING + (CONTENT_PADDING - DELETE_ICON_SIZE / 2),
    paddingRight: CONTENT_PADDING + (CONTENT_PADDING - DELETE_ICON_SIZE / 2),
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
  screenContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  ctaButtonContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  ctaButtonWrapper: {
    alignSelf: 'stretch',
  },
  scrollContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollWrapper: {
    alignSelf: 'stretch',
    flex: 1,
  },
});

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    signatures: selectSignatures(state),
    pictures: selectPictures(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteSignatureAt: index => dispatch(deleteSignatureAt(index)),
    deletePictureAt: index => dispatch(deletePictureAt(index)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompleteTask);
