import Task from "@/src/types/task";
import { useCallback } from "react";
import { useTaskListsContext } from "../../courier/contexts/TaskListsContext";

export const useTaskLongPress = () => {
  const context = useTaskListsContext();

  return useCallback(
    (task: Task) => {
        console.log(task)
        context?.setSelectedTasksToEdit(prevTasks => [...prevTasks, task]);
    },
    [context]
  );
};