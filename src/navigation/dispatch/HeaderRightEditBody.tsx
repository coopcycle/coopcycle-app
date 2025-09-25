import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EllipsisVertical } from "lucide-react-native";

import { useTaskListsContext } from "../courier/contexts/TaskListsContext";
import TasksMenu from "../components/TasksMenu";

export const HeaderRightEditBody = () => {
  const options = [
    {
      key: "Complete Task",
      text: "Completar",
      action: () => {console.log("COMPLETE TASK")},
    },
    {
      key: "Cancel Task",
      text: "Cancelar",
      action: () => {console.log("CANCEL TASK")},
    },
    {
      key: "Report incidence",
      text: "Reportar Incidencia",
      action: () => {console.log("REPORT INCIDENCE")},

    },
    {
      key: "Edit",
      text: "Editar",
      action: () => {console.log("EDIT TASK")},
    },
  ] 
  const context = useTaskListsContext();

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