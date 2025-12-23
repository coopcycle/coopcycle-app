import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { greenColor, yellowColor } from '@/src/styles/common';
import { markTaskDone } from '@/src/redux/Courier';
import Task from '@/src/types/task';
import { useReportFormContext } from '../contexts/ReportFormContext';
import { usePostIncidentMutation } from '@/src/redux/api/slice';
import {
  CompleteTaskFormValues,
  ReportIncidentFormValues,
  buildReportIncidentPayload,
} from '../utils/taskFormHelpers';
import { showAlert } from '@/src/utils/alert';
import { useFormikContext } from 'formik';
import { reportIncidentFlow } from '@/src/redux/Courier/taskActions';
import { useAppDispatch } from '@/src/redux/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigateOnSuccess } from '@/src/navigation/task/hooks/useNavigateOnSuccess';

type Props = {
  //TaskComplete
  task: Task;
  tasks?: Task[];
  //Report Incident - Complete
  validateTaskAfterReport?: boolean;
  success: boolean;
  //Report Incident - Edit
  currentTab?: string;
};

export const SubmitButton = ({
  task,
  tasks,
  validateTaskAfterReport,
  success,
  currentTab = null,
}: Props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {
    values: formValues,
    touched: formTouchedFields,
    isSubmitting,
    handleSubmit,
    setSubmitting,
  } = useFormikContext<CompleteTaskFormValues | ReportIncidentFormValues>();

  const footerBgColor = success ? greenColor : yellowColor;
  const [postIncident, { isLoading, error }] = usePostIncidentMutation();

  const navigateOnSuccess = useNavigateOnSuccess();

  const handlePress = () => {
    if (success) {
      handleSubmit();
    } else {
      // handle form submission manually

      setSubmitting(true);

      const payload = buildReportIncidentPayload(
        task,
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
                markTaskDone(
                  task,
                  formValues.notes,
                  navigateOnSuccess,
                  formValues.contactName,
                ),
              );
            }
            navigateOnSuccess();

            setSubmitting(false);
          },
          () => {
            setSubmitting(false);
          },
        ),
      );
    }
  };

  const isButtonDisabled = isSubmitting || isLoading;

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
        opacity: isSubmitting ? 0.6 : 1,
      }}
      testID={`task:finishButton${currentTab ? '-' + currentTab : ''}`}
    >
      <HStack className="py-3 items-center">
        <Text style={{ fontWeight: 'bold', color: '#000' }}>
          {success ? t('VALIDATE') : t('REPORT_INCIDENT')}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};
