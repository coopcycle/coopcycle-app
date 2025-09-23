import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EllipsisVertical } from "lucide-react-native";

import { useTaskListsContext } from "../courier/contexts/TaskListsContext";
import TasksMenu from "../components/TasksMenu";

export const HeaderRightEditBody = () => {
    const context = useTaskListsContext();
    return (
        <TouchableOpacity>
            <View style={styles.container} >
                <Text style={styles.counter}>{context?.selectedTasksToEdit.length}</Text>
                <EllipsisVertical />
            </View>
            <TasksMenu />
        </TouchableOpacity>
    );
};

// TODO: Modify
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 10
    },
    counter: {
        color: "white",
        backgroundColor: "#666",
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        textAlign: 'center'
    }
});
