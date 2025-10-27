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

export const SubmitButton = ({
  task,
  tasks,
  notes,
  contactName,
  failureReason,
  validateTaskAfterReport,
  failureReasonMetadataToSend,
  success,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const footerBgColor = success ? greenColor : yellowColor;

  const onPress = () => {
    const navigateOnSuccess = () => {
      // Make sure to use merge = true, so that it doesn't break
      // when navigating to DispatchTaskList

      if (route.params?.navigateAfter !== null) {
        navigation.navigate({
          name: route.params?.navigateAfter,
          merge: true,
        });
      } else {
        navigation.goBack();
      }
    };

    // Disable the button
    setIsDisabled(true);

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
            if (validateTaskAfterReport) {
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
      onPress={onPress}
      disabled={isDisabled}
      style={{ alignItems: 'center', backgroundColor: footerBgColor }}
      testID="task:finishButton">
      <HStack className="py-3 items-center">
        <Text>{success ? t('VALIDATE') : t('REPORT_INCIDENT')}</Text>
      </HStack>
    </TouchableOpacity>
  );
};