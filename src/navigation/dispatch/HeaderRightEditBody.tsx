import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EllipsisVertical } from "lucide-react-native";
import { useState } from "react";

import { useTaskListsContext } from "../courier/contexts/TaskListsContext";
import TasksMenu from "../components/TasksMenu";

export const HeaderRightEditBody = () => {
  const context = useTaskListsContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePress = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.container}>
          <Text style={styles.counter}>
            {context?.selectedTasksToEdit.length}
          </Text>
          <EllipsisVertical color="white" size={20} />
        </View>
      </TouchableOpacity>

      <TasksMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
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