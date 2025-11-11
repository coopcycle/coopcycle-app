import Task from "@/src/types/task";
import { useCallback } from "react";
import { useTaskListsContext } from "../../courier/contexts/TaskListsContext";

export const useTaskLongPress = () => {
  const context = useTaskListsContext();

  return useCallback(
    (task: Task) => {
      if (task.status !== 'CANCELLED') {
        context?.toggleTaskSelection(task);
      }
    },
    [context]
  );
};
