import { Divider } from '@/components/ui/divider';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import { User } from 'lucide-react-native';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  AvoidSoftInput,
  useSoftInputHeightChanged,
} from 'react-native-avoid-softinput';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { selectHttpClient } from '../../redux/App/selectors';
import {
  deletePictureAt,
  deleteSignatureAt,
  selectPictures,
  selectSignatures,
} from '../../redux/Courier';
import { isDropoff } from './components/utils';
import { SubmitButton } from './components/SubmitButton';
import { ContactNameModal } from './components/ContactNameModal';
import { FailureReasonForm } from './components/FailureReasonForm';
import { MultipleTasksLabel } from './components/MultipleTasksLabel';
import { FailureReasonPicker } from './components/FailureReasonPicker';
import { AttachmentItem } from './components/AttachmentItem';
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { PoDButton } from './components/PoDButton';
import { useReportFormContext } from './contexts/ReportFormContext';

const DELETE_ICON_SIZE = 32;
const CONTENT_PADDING = 20;

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
  return Object.prototype.hasOwnProperty.call(route.params || {}, 'success')
    ? route.params?.success
    : true;
}

const parseInitialData = data => {
  const asQueryString = data.map(v => `${v.name}=${v.value}`).join('&');
  return qs.parse(asQueryString);
};

const CompleteTask = ({
  httpClient,
  signatures,
  pictures,
  deleteSignatureAt,
  deletePictureAt,
}) => {
  const { t } = useTranslation();
  const route = useRoute();
  const task = route.params?.task;
  const tasks = route.params?.tasks;

  const formContext = useReportFormContext();
  
  const formState = formContext?.formState || {
    notes,
    failureReason,
    failureReasonMetadata,
    task,
  };

  const success = isSuccessRoute(route);

  const [notes, setNotes] = useState(formState.notes);
  const [failureReason, setFailureReason] = useState(formState.failureReason);
  const [isContactNameModalVisible, setIsContactNameModalVisible] =
    useState(false);
  const [contactName, setContactName] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [validateTaskAfterReport, setValidateTaskAfterReport] = useState(
    formState.task.status === 'DONE' || false
  );

  const [failureReasonMetadata, setFailureReasonMetadata] = useState(formState.failureReasonMetadata);
  const [failureReasonMetadataToSend, setFailureReasonMetadataToSend] =
    useState([]);

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
    failureReasonMetadataToSend;
  });

  return (
    <React.Fragment>
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={styles.screenContainer}>
        <View style={styles.scrollWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            contentInsetAdjustmentBehavior="always">
            <VStack style={{ flex: 1 }} className="w-full">
              <MultipleTasksLabel tasks={tasks} />
              <TouchableWithoutFeedback
                // We need to disable TouchableWithoutFeedback when keyboard is not visible,
                // otherwise the ScrollView for proofs of delivery is not scrollable
                disabled={!isKeyboardVisible}
                // This allows hiding the keyboard when touching anything on the screen
                onPress={Keyboard.dismiss}>
                <VStack>
                  {isDropoff(task, tasks) && (
                    <React.Fragment>
                      <HStack className="justify-between items-center p-3">
                        <HStack className="justify-between items-center">
                          <Icon as={User} style={{ marginRight: 10 }} />
                          <Text numberOfLines={1}>
                            {resolveContactName(contactName, task, tasks)}
                          </Text>
                        </HStack>
                        <TouchableOpacity
                          onPress={() => setIsContactNameModalVisible(true)}>
                          <Text>{t('EDIT')}</Text>
                        </TouchableOpacity>
                      </HStack>
                      <Divider />
                    </React.Fragment>
                  )}
                  {!success && (
                    <FormControl className="p-3">
                      <FormControlLabel>
                        <FormControlLabelText>
                          {t('INCIDENT_TYPE')}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <FailureReasonPicker
                        task={task}
                        httpClient={httpClient}
                        onValueChange={(code, obj) => {
                          if (obj && obj.metadata) {
                            formContext.updateFormField('failureReasonMetadata', obj.metadata);
                            setFailureReasonMetadataToSend(
                              parseInitialData(obj.metadata),
                            );
                          } else {
                            formContext.updateFormField('failureReasonMetadata', []);
                            setFailureReasonMetadataToSend([]);
                          }
                          formContext.updateFormField('failureReason', code);
                        }}
                      />
                      {Array.isArray(failureReasonMetadata) &&
                      failureReasonMetadata.length > 0 ? (
                        <FailureReasonForm
                          data={failureReasonMetadata}
                          onChange={metadata => {
                            formContext.updateFormField('failureReasonMetadata', metadata);
                          }}
                          parseInitialData={parseInitialData}
                        />
                      ) : null}
                    </FormControl>
                  )}
                  <FormControl className="p-3">
                    <FormControlLabel>
                      <FormControlLabelText>{t('NOTES')}</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="mb-6">
                      <TextareaInput
                        autoCorrect={false}
                        totalLines={2}
                        onChangeText={text => formContext.updateFormField('notes', text)}
                      />
                    </Textarea>
                    {/* task.status !== 'DONE' DISABLE CHECKBOX display always checked if DONE */}
                    {!success && (
                      <Checkbox
                        className="mb-6"
                        value={'validate_task'}
                        defaultIsChecked={validateTaskAfterReport}
                        onChange={() => {
                          setValidateTaskAfterReport(!validateTaskAfterReport);
                        }}>
                        <CheckboxIndicator>
                          {validateTaskAfterReport && <CheckIcon />}
                        </CheckboxIndicator>
                        <CheckboxLabel>{t('VALIDATE_TASK')}</CheckboxLabel>
                      </Checkbox>
                    )}
                    <PoDButton task={task} tasks={tasks} />
                  </FormControl>
                  <View>
                    <ScrollView style={{ height: '50%' }}>
                      <View style={styles.content}>
                        <View style={styles.imagesContainer}>
                          {signatures.map((base64, key) => (
                            <AttachmentItem
                              key={`signatures:${key}`}
                              base64={base64}
                              onPressDelete={() => deleteSignatureAt(key)}
                            />
                          ))}
                          {pictures.map((base64, key) => (
                            <AttachmentItem
                              key={`pictures:${key}`}
                              base64={base64}
                              onPressDelete={() => deletePictureAt(key)}
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
        <Animated.View
          style={[buttonContainerAnimatedStyle, styles.ctaButtonWrapper]}>
          <View style={styles.ctaButtonContainer}>
            <VStack className="w-full">
              <SubmitButton
                task={task}
                tasks={tasks}
                notes={notes}
                contactName={contactName}
                failureReason={failureReason}
                validateTaskAfterReport={validateTaskAfterReport}
                failureReasonMetadataToSend={failureReasonMetadataToSend}
                success={isSuccessRoute(route)}
              />
            </VStack>
          </View>
        </Animated.View>
      </SafeAreaView>
      <ContactNameModal
        isVisible={isContactNameModalVisible}
        onSwipeComplete={() => setIsContactNameModalVisible(false)}
        initialValues={initialValues}
        onSubmit={values => {
          setContactName(values.contactName);
          setIsContactNameModalVisible(false);
        }}
      />
    </React.Fragment>
  );
};

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
    httpClient: selectHttpClient(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(CompleteTask);
