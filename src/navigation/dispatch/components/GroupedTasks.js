import { Text } from "native-base";
import { useDispatch, useSelector } from "react-redux";

import { navigateToTask } from '../../../navigation/utils';
import { selectTasksWithColor } from "../../../shared/logistics/redux";
import { selectUnassignedTasksNotCancelled } from "../../../redux/Dispatch/selectors";
import { unassignTask } from "../../../redux/Dispatch/actions";
import TaskList from "../../../components/TaskList";


export default function GroupedTasks({
  tasks,
  title,
  navigation,
  route,
}) {
  const dispatch = useDispatch();

  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const unassignTaskHandler = task => dispatch(unassignTask(task))

  return (
    <>
      <Text>{title}</Text>
      <TaskList
        tasks={tasks}
        tasksWithColor={tasksWithColor}
        onSwipeRight={unassignTaskHandler}
        swipeOutRightEnabled={task => task.status !== 'DONE'}
        swipeOutRightIconName="close"
        onTaskClick={task =>
          navigateToTask(
            navigation,
            route,
            task,
            unassignedTasks,
          )
        }
      />
    </>)
}
