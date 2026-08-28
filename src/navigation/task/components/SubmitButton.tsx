import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { greenColor, yellowColor } from '@/src/styles/common';
import { markTaskDone } from '@/src/redux/Courier';
import Task from '@/src/types/task';
import { usePostIncidentMutation } from '@/src/redux/api/slice';
import {
  CompleteTaskFormValues,
  FAILURE_REASONS_REQUIRING_NOTES,
  ReportIncidentFormValues,
  buildReportIncidentPayload,
} from '../utils/taskFormHelpers';
import { showAlert } from '@/src/utils/alert';
import { useFormikContext } from 'formik';
import { reportIncidentFlow } from '@/src/redux/Courier/taskActions';
import { useAppDispatch } from '@/src/redux/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigateOnSuccess } from '@/src/navigation/task/hooks/useNavigateOnSuccess';

// How long a submission may run before we say something. The HTTP client
// gives up at 30s; until then the courier is looking at a screen that used to
// give no sign the tap had registered at all.
const SLOW_SUBMIT_MS = 8000;

type Props = {
  //TaskComplete
  task: Task;
  tasks?: Task[];
  //Report Incident - Complete
  validateTaskAfterReport?: boolean;
  success: boolean;
  isFailureReasonsLoaded?: boolean;
  //Report Incident - Edit
  currentTab?: string;
};

export const SubmitButton = ({
  task,
  tasks,
  validateTaskAfterReport,
  success,
  isFailureReasonsLoaded,
  currentTab = undefined,
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
  const pendingSubmitRef = useRef(false);

  const isBusy = isSubmitting || isLoading;
  const [isSlow, setIsSlow] = useState(false);

  // `pendingSubmitRef` only has to bridge the gap between the tap and the
  // submitting flags catching up. Clearing it here means a failed submission
  // no longer leaves the button permanently dead.
  useEffect(() => {
    if (!isBusy) {
      pendingSubmitRef.current = false;
    }
  }, [isBusy]);

  useEffect(() => {
    if (!isBusy) {
      setIsSlow(false);
      return;
    }

    const timeout = setTimeout(() => setIsSlow(true), SLOW_SUBMIT_MS);

    return () => clearTimeout(timeout);
  }, [isBusy]);

  const handlePress = () => {
    if (pendingSubmitRef.current || isSubmitting || isLoading) return;
    pendingSubmitRef.current = true;

    if (success) {
      handleSubmit();
    } else {
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
            pendingSubmitRef.current = false;
            if (validateTaskAfterReport) {
              dispatch(
                markTaskDone(
                  task,
                  formValues.notes,
                  () => {
                    setSubmitting(false);
                    navigateOnSuccess();
                  },
                  formValues.contactName,
                ),
              );
            } else {
              setSubmitting(false);
              navigateOnSuccess();
            }
          },
          () => {
            pendingSubmitRef.current = false;
            setSubmitting(false);
          },
        ),
      );
    }
  };

  const incidentValues = !success
    ? (formValues as ReportIncidentFormValues)
    : null;

  const isNotesRequired =
    incidentValues !== null &&
    FAILURE_REASONS_REQUIRING_NOTES.includes(
      incidentValues.failureReason as (typeof FAILURE_REASONS_REQUIRING_NOTES)[number],
    );

  const isButtonDisabled =
    isSubmitting ||
    isLoading ||
    (!success && !isFailureReasonsLoaded) ||
    (!success && !incidentValues?.failureReason) ||
    (isNotesRequired && !incidentValues?.notes);

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
        opacity: isButtonDisabled ? 0.6 : 1,
      }}
      testID={`task:finishButton${currentTab ? '-' + currentTab : ''}`}
    >
      <VStack className="py-3 items-center">
        <HStack className="items-center" space="sm">
          {isBusy && (
            <ActivityIndicator
              size="small"
              color="#000"
              testID="task:finishButtonSpinner"
            />
          )}
          <Text style={{ fontWeight: 'bold', color: '#000' }}>
            {success ? t('VALIDATE') : t('REPORT_INCIDENT')}
          </Text>
        </HStack>
        {isSlow && (
          <Text style={{ color: '#000', fontSize: 12 }}>
            {t('TASK_SUBMIT_SLOW')}
          </Text>
        )}
      </VStack>
    </TouchableOpacity>
  );
};
