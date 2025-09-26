import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EllipsisVertical } from "lucide-react-native";

import { useTaskListsContext } from "../courier/contexts/TaskListsContext";
import TasksMenu from "../components/TasksMenu";
import { navigateToCompleteTask } from "../utils";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { startTask } from "@/src/redux/Courier";

export const HeaderRightEditBody = ({navigation}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const context = useTaskListsContext();
  const selectedTasks = context?.selectedTasksToEdit;
  const route = useRoute();
  const options = [
    {
      key: "Start Task",
      text: t('START'),
      action: () => {
        selectedTasks?.forEach((t) => {
          return dispatch(startTask(t, () => {console.log("TASK START")})) 
        })
      },
    },
    {
      key: "Complete Task",
      text: t('COMPLETE_TASK'),
      action: () => {
        navigateToCompleteTask(navigation, route, null, selectedTasks, true);
      },
    },
    {
      key: "Cancel Task",
      text: t('CANCEL'),
      action: () => {
        // TODO: Implement endpoint request to send tasks to cancel
        console.log("CANCEL TASK")
      },
    },
    {
      key: "Report incidence",
      text: t('REPORT_INCIDENT'),
      isDisabled: selectedTasks?.length > 1,
      action: () => { 
        return selectedTasks?.length > 1 ?
            
          console.log("REPORT INCIDENTS")
          : 
          navigateToCompleteTask(navigation, route, selectedTasks[0], [], false)
      },
    },
    {
      key: "Edit",
      text: t('EDIT'),
      isDisabled: true,
      action: () => {
        //TODO: Implement edit feature as described at https://github.com/coopcycle/coopcycle/issues/498
        console.log("EDIT TASK")
      },
    },
  ] 

  return (
    <View>
      <TasksMenu 
      options={options}
      renderTrigger={(triggerProps) => (
        <TouchableOpacity  {...triggerProps}>
          <View style={styles.container}>
            <Text style={styles.counter}>
              {context?.selectedTasksToEdit.length}
            </Text>
            <EllipsisVertical size={20} />
          </View>
        </TouchableOpacity>
      )}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  counter: {
    color: "white",
    backgroundColor: "#666",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    textAlign: 'center',
  },
});