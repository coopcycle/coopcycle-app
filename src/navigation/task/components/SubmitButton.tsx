import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { greenColor, yellowColor } from '@/src/styles/common';
import { markTaskDone, markTasksDone } from '@/src/redux/Courier';
import Task from '@/src/types/task';
import { useReportFormContext } from '../contexts/ReportFormContext';
import { useTaskListsContext } from '../../courier/contexts/TaskListsContext';
import { usePostIncidentMutation } from '@/src/redux/api/slice';
import {
  EditFormValues,
  buildReportIncidentPayload,
} from '../utils/taskFormHelpers';
import { showAlert } from '@/src/utils/alert';
import { FormikTouched } from 'formik';
import { reportIncidentFlow } from '@/src/redux/Courier/taskActions';
import { useAppDispatch } from '@/src/redux/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SubmitButtonProps {
  //TaskComplete
  task: Task;
  tasks?: Task[];
  notes?: string;
  //Report Incident - Complete
  contactName?: string;
  failureReason?: string;
  validateTaskAfterReport?: boolean;
  failureReasonMetadataToSend?: [];
  success: boolean;
  //Report Incident - Edit
  currentTab?: string;
  formValues?: EditFormValues;
  formTouchedFields?: FormikTouched<EditFormValues>;
  onPress?: () => void;
}

export const SubmitButton = ({
  task,
  tasks,
  notes,
  contactName,
  validateTaskAfterReport,
  success,
  currentTab = null,
  formValues,
  formTouchedFields,
  onPress,
}: SubmitButtonProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const formContext = useReportFormContext();
  const TaskListsContext = useTaskListsContext();
  const { formStateToSend, startSubmitting, stopSubmitting } =
    formContext || {};
  const hasFormContext = !!formContext;

  const [isDisabled, setIsDisabled] = useState(false);

  const footerBgColor = success ? greenColor : yellowColor;
  const [postIncident, { isLoading, error }] = usePostIncidentMutation();

  const handlePress = () => {
    hasFormContext && startSubmitting();
    setIsDisabled(true);
    const navigateOnSuccess = () => {
      TaskListsContext?.clearSelectedTasks();
      if (route.params?.navigateAfter !== null) {
        navigation.navigate({
          name: route.params?.navigateAfter,
          merge: true,
        });
      } else {
        navigation.goBack();
      }
    };

    if (success) {
      if (tasks && tasks.length) {
        dispatch(markTasksDone(tasks, notes, navigateOnSuccess, contactName));
      } else {
        dispatch(markTaskDone(task, notes, navigateOnSuccess, contactName));
      }
    } else {
      const payload = buildReportIncidentPayload(
        formStateToSend,
        formValues,
        formTouchedFields,
      );
      dispatch(
        reportIncidentFlow(
          task,
          () => postIncident({ payload }).unwrap(),
          () => {
            if (validateTaskAfterReport) {
              dispatch(
                markTaskDone(task, notes, navigateOnSuccess, contactName),
              );
            }
            navigateOnSuccess();

            stopSubmitting();
            setIsDisabled(false);
          },
          () => {
            stopSubmitting();
            setIsDisabled(false);
          },
        ),
      );
    }

    if (onPress) {
      onPress();
    }
  };

  const isButtonDisabled = isDisabled || isLoading;

  useEffect(() => {
    if (error) {
      showAlert(error.data);
    }
  }, [error]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isButtonDisabled}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: footerBgColor,
        marginTop: 16,
        paddingBottom: insets.bottom,
        opacity: isDisabled ? 0.6 : 1,
      }}
      testID={`task:finishButton${currentTab ? '-' + currentTab : ''}`}>
      <HStack className="py-3 items-center">
        <Text style={{ fontWeight: 'bold', color: '#000' }}>
          {success ? t('VALIDATE') : t('REPORT_INCIDENT')}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};
