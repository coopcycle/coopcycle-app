import { Box, Text } from "native-base";
import { useDispatch, useSelector } from "react-redux";

import TaskList from "../../../components/TaskList";
import { navigateToTask } from '../../../navigation/utils';
import { assignTask, bulkAssignmentTasks, unassignTask } from "../../../redux/Dispatch/actions";
import { selectUnassignedTasksNotCancelled } from "../../../redux/Dispatch/selectors";
import { selectTasksWithColor } from "../../../shared/logistics/redux";
import { headerFontSize } from "../../../styles/common";
import { useNavigation } from '@react-navigation/native';


export default function GroupedTasks({
  backgroundColor,
  textColor,
  route,
  tasks,
  tasksType,
  title,
}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const unassignTaskHandler = task => dispatch(unassignTask(task))

  const allowToSelect = (task) => {
    return task.status !== 'DONE';
  }

  // todo update to use slice when mergin branch 313
  const _assignTask = (task, user) => {
    navigation.navigate('DispatchUnassignedTasks');
    dispatch(assignTask(task, user.username));
  }

  const _bulkAssign = (user) => {
      navigation.navigate('DispatchUnassignedTasks');
      dispatch(bulkAssignmentTasks(tasks, user.username));
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
