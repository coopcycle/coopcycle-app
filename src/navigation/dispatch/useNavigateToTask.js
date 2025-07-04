import { getTaskListTasks, getUserTaskList } from "../../shared/src/logistics/redux/taskListUtils";
import { withLinkedTasks } from "../../shared/src/logistics/redux/taskUtils";
import { navigateToTask } from "../utils";

export default function useNavigateToTask({
  allTaskLists,
  navigation,
  route,
  tasksEntities,
}) {
  return (isUnassignedTaskList, task) => {
    // If task is unassigned, related tasks are order's tasks
    // If task is assigned, related tasks are task's task list's tasks
    if (isUnassignedTaskList) {
      const allTasks = Object.values(tasksEntities);
      const allRelatedTasks = withLinkedTasks(task, allTasks);
      navigateToTask(navigation, route, task, allRelatedTasks);
    } else {
      const username = task.assignedTo;
            const taskList = getUserTaskList(username, allTaskLists)
      const relatedTasks = getTaskListTasks(taskList, tasksEntities);
      navigateToTask(navigation, route, task, relatedTasks);
    }
  }
}
