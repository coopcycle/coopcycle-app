import { useNavigation } from "@react-navigation/native";
import { selectTaskLists, selectTasksEntities } from "../../../shared/logistics/redux";
import { useDispatch, useSelector } from "react-redux";
import useSetTaskListItems from "../../../shared/src/logistics/redux/hooks/useSetTaskListItems";
import { useCallback } from "react";
import { navigateToOrder, navigateToTask } from "../../utils";
import { getOrderId } from "../../../utils/tasks";
import { withLinkedTasks } from "../../../shared/src/logistics/redux/taskUtils";
import { getTaskListTasks, getTasksListIdsToEdit, getUserTaskList } from "../../../shared/src/logistics/redux/taskListUtils";
import { clearSelectedTasks } from "../../../redux/Dispatch/updateSelectedTasksSlice";
import { UNASSIGNED_TASKS_LIST_ID } from "../../../shared/src/constants";

export const useTaskManagement = (route) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const tasksEntities = useSelector(selectTasksEntities);
    const allTaskLists = useSelector(selectTaskLists);

  const {
    assignTask,
    bulkEditTasks,
    assignTaskWithRelatedTasks,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  } = useSetTaskListItems({
    allTaskLists,
    tasksEntities,
  });

  const onSelectNewAssignation = useCallback(
      callback => {
      navigation.navigate('DispatchAllTasks');
      callback();
      },
      [navigation],
  );

    const onOrderClick = useCallback(
      task => {
        const orderId = getOrderId(task);
        navigateToOrder(navigation, orderId);
      },
      [navigation],
    );
  
    const onTaskClick = useCallback(
      (isUnassignedTaskList: boolean) => task => {
        // If task is unassigned, related tasks are order's tasks
        // If task is assigned, related tasks are task's task list's tasks
        if (isUnassignedTaskList) {
          const allTasks = Object.values(tasksEntities);
          const allRelatedTasks = withLinkedTasks(task, allTasks);
          navigateToTask(navigation, route, task, allRelatedTasks);
        } else {
          const username = task.assignedTo;
          const taskList = getUserTaskList(username, allTaskLists);
          const relatedTasks = getTaskListTasks(taskList, tasksEntities);
          navigateToTask(navigation, route, task, relatedTasks);
        }
      },
      [allTaskLists, navigation, route, tasksEntities],
    );

    const assignTaskWithRelatedTasksHandler = useCallback(
      isUnassignedTaskList => task => {
        const onItemPress = user =>
          onSelectNewAssignation(() =>
            (isUnassignedTaskList
              ? assignTaskWithRelatedTasks
              : reassignTaskWithRelatedTasks)(task, user),
          );
  
        const onUnassignButtonPress = () =>
          onSelectNewAssignation(() => unassignTaskWithRelatedTasks(task));
  
        navigation.navigate('DispatchPickUser', {
          onItemPress,
          onUnassignButtonPress,
          showUnassignButton: !isUnassignedTaskList,
        });
      },
      [
        onSelectNewAssignation,
        assignTaskWithRelatedTasks,
        navigation,
        reassignTaskWithRelatedTasks,
        unassignTaskWithRelatedTasks,
      ],
    );
  
    const assignTaskHandler = useCallback(
      isUnassignedTaskList => task => {
        const onItemPress = user =>
          onSelectNewAssignation(() =>
            (isUnassignedTaskList ? assignTask : reassignTask)(task, user),
          );
  
        const onUnassignButtonPress = () =>
          onSelectNewAssignation(() => unassignTask(task));
  
        navigation.navigate('DispatchPickUser', {
          onItemPress,
          showUnassignButton: !isUnassignedTaskList,
          onUnassignButtonPress,
        });
      },
      [
        onSelectNewAssignation,
        assignTask,
        navigation,
        reassignTask,
        unassignTask,
      ],
    );

    const handleBulkAssignButtonPress = useCallback(
      selectedTasks => {
        const tasksListIdsToEdit = getTasksListIdsToEdit(selectedTasks);
        const showUnassignButton =
          tasksListIdsToEdit.length > 0 &&
          tasksListIdsToEdit.some(id => id !== UNASSIGNED_TASKS_LIST_ID);
  
        navigation.navigate('DispatchPickUser', {
          onItemPress: user => {
            onSelectNewAssignation(async () => {
              await bulkEditTasks(selectedTasks, user);
              dispatch(clearSelectedTasks());
            });
          },
          showUnassignButton,
          onUnassignButtonPress: () => {
            onSelectNewAssignation(async () => {
              await bulkEditTasks(selectedTasks);
              dispatch(clearSelectedTasks());
            });
          },
        });
      },
      [onSelectNewAssignation, bulkEditTasks, dispatch, navigation],
    );

  return {
    onSelectNewAssignation,
    onOrderClick,
    onTaskClick,
    bulkEditTasks,
    handleBulkAssignButtonPress,
    assignTask,
    assignTaskWithRelatedTasks,
    assignTaskWithRelatedTasksHandler,
    assignTaskHandler,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  }
}
