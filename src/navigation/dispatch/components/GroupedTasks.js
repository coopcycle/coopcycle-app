import { Box, Text } from "native-base";
import { useDispatch, useSelector } from "react-redux";

import TaskList from "../../../components/TaskList";
import { navigateToTask } from '../../../navigation/utils';
import { unassignTask } from "../../../redux/Dispatch/actions";
import { selectUnassignedTasksNotCancelled } from "../../../redux/Dispatch/selectors";
import { selectTasksWithColor } from "../../../shared/logistics/redux";
import { headerFontSize } from "../../../styles/common";


export default function GroupedTasks({
  backgroundColor,
  textColor,
  navigation,
  route,
  tasks,
  title,
}) {
  const dispatch = useDispatch();

  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const unassignTaskHandler = task => dispatch(unassignTask(task))

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
          tasksWithColor={tasksWithColor}
          onSwipeRight={unassignTaskHandler}
          swipeOutRightEnabled={task => task.status !== 'DONE'}
          swipeOutRightIconName="close"
          swipeOutLeftEnabled={task => task.assignedTo === null}
          onTaskClick={task =>
            navigateToTask(
              navigation,
              route,
              task,
              unassignedTasks,
            )
          }
        />
      </Box>
    </Box>)
}
