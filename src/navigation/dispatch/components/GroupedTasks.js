import { Box, Text } from "native-base";
import { useSelector } from "react-redux";

import { headerFontSize } from "../../../styles/common";
import { navigateToTask } from '../../../navigation/utils';
import { selectTasksWithColor } from "../../../shared/logistics/redux";
import { selectUnassignedTasksNotCancelled } from "../../../redux/Dispatch/selectors";
import { useNavigation } from '@react-navigation/native';
import TaskList from "../../../components/TaskList";
import useSetTaskListsItems from "../../../shared/src/logistics/redux/hooks/useSetTaskListItems";


export default function GroupedTasks({
  backgroundColor,
  textColor,
  route,
  tasks,
  tasksType,
  title,
}) {
  const navigation = useNavigation();

  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const {
    assignTaskWithRelatedTasks,
    bulkAssignTasksWithRelatedTasks,
    unassignTaskWithRelatedTasks,
  } = useSetTaskListsItems();

  const allowToSelect = (task) => {
    return task.status !== 'DONE';
  }

  const unassignTaskHandler = (task) => {
    unassignTaskWithRelatedTasks(task)
  }

  const _assignTask = (task, user) => {
    assignTaskWithRelatedTasks(task, user);
  }

  const _bulkAssign = (user) => {
    bulkAssignTasksWithRelatedTasks(tasks, user);
  }

  const assignSelectedTasks = (selectedTasks) => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  return (
    <Box marginBottom={4}>
      <Box backgroundColor={backgroundColor}>
        <Text
          color={textColor}
          fontSize={headerFontSize}
          padding={4}
        >
          {title}
        </Text>
      </Box>
      <Box paddingHorizontal={8}>
        <TaskList
          tasks={tasks}
          tasksType={tasksType}
          tasksWithColor={tasksWithColor}
          onSwipeRight={unassignTaskHandler}
          swipeOutRightEnabled={task => task.status !== 'DONE'}
          swipeOutRightIconName="close"
          swipeOutLeftEnabled={task => !task.isAssigned}
          onSwipeLeft={task =>
            navigation.navigate('DispatchPickUser', {
              onItemPress: user => _assignTask(task, user),
            })
          }
          swipeOutLeftIconName="user"
          onTaskClick={task =>
            navigateToTask(
              navigation,
              route,
              task,
              unassignedTasks,
            )
          }
          allowMultipleSelection={allowToSelect}
          multipleSelectionIcon="user"
          onMultipleSelectionAction={assignSelectedTasks}
        />
      </Box>
    </Box>)
}
