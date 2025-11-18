import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { greenColor, yellowColor } from "@/src/styles/common";
import { markTaskDone, markTasksDone } from "@/src/redux/Courier";
import Task from "@/src/types/task";
import { useReportFormContext } from "../contexts/ReportFormContext";
import { usePostIncidentMutation } from "@/src/redux/api/slice";
import { buildReportIncidentPayload } from "../utils/taskFormHelpers";
import { showAlert } from "@/src/utils/alert";

interface SubmitButtonProps {
  task: Task;
  tasks?: Task[];
  notes?: string;
  contactName?: string;
  failureReason?: string;
  validateTaskAfterReport?: boolean;
  failureReasonMetadataToSend?: [];
  success: boolean;
  onSubmit?: (formData) => void;
  onPress?: () => void;
}

export const SubmitButton = ({
  task,
  tasks,
  notes,
  contactName,
  success,
}: SubmitButtonProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  


const formContext = useReportFormContext();
const { formStateToSend, startSubmitting, stopSubmitting } = formContext || {};
  const hasFormContext = !!formContext;
  
  const [isDisabled, setIsDisabled] = useState(false);

  const footerBgColor = success ? greenColor : yellowColor;
  const [postIncident, { isLoading, error }] =  usePostIncidentMutation();

  const handlePress = () => {
    hasFormContext && startSubmitting();
    setIsDisabled(true);
    const navigateOnSuccess = () => {
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
      const payload = buildReportIncidentPayload(formStateToSend);
      postIncident({ payload }).unwrap()
      .then((r) => {
        navigateOnSuccess();
      })
      .catch((e) => {})
      .finally(() => {
        stopSubmitting();
        setIsDisabled(false);
      });
    };
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
        opacity: isDisabled ? 0.6 : 1,
      }}
      testID="task:finishButton">
      <HStack className="py-3 items-center">
        <Text style={{ fontWeight: 'bold', color: '#000' }}>
          {success ? t('VALIDATE') : t('REPORT_INCIDENT')}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};