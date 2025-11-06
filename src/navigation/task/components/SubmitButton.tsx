import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { greenColor, yellowColor } from "@/src/styles/common";
import { markTaskDone, markTasksDone } from "@/src/redux/Courier";
import { reportIncident } from "@/src/redux/Courier/taskActions";
import Task from "@/src/types/task";

interface SubmitButtonProps {
  task: Task;
  tasks?: Task[];
  notes?: string;
  contactName?: string;
  failureReason?: string;
  validateTaskAfterReport?: boolean;
  failureReasonMetadataToSend?: [];
  success: boolean;
  formData?;
  onSubmit?: (formData) => void;
  onPress?: () => void;
}

export const SubmitButton = ({
  task,
  tasks,
  notes,
  contactName,
  failureReason,
  validateTaskAfterReport,
  failureReasonMetadataToSend,
  success,
  formData,
  onSubmit,
  onPress: customOnPress,
}: SubmitButtonProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const footerBgColor = success ? greenColor : yellowColor;

  const handlePress = () => {
    setIsDisabled(true);


    // Si hay onSubmit con formData, usarlo
    if (onSubmit && formData) {
      console.log('Calling onSubmit with formData:', formData);
      onSubmit(formData);
      return;
    }

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
      dispatch(
        reportIncident(
          task,
          notes,
          failureReason,
          failureReasonMetadataToSend,
          () => {
            if (task.status !== 'DONE' && validateTaskAfterReport) {
              dispatch(
                markTaskDone(task, notes, navigateOnSuccess, contactName),
              );
            } else {
              navigateOnSuccess();
            }
          },
        ),
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
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