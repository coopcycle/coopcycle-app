import { Box, Text } from "native-base";
import { useSelector } from "react-redux";

import TaskList from "../../../components/TaskList";
import { navigateToTask } from '../../../navigation/utils';
import { selectUnassignedTasksNotCancelled } from "../../../redux/Dispatch/selectors";
import { selectTasksWithColor } from "../../../shared/logistics/redux";
import { headerFontSize } from "../../../styles/common";
import { useNavigation } from '@react-navigation/native';
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
    unassignTaskWithRelatedTasks,
    assignTaskWithRelatedTasks,
    bulkAssignTasksWithRelatedTasks
   } = useSetTaskListsItems()

  const unassignTaskHandler = task => unassignTaskWithRelatedTasks(task)

  const allowToSelect = (task) => {
    return task.status !== 'DONE';
  }

  const _assignTask = (task, user) => {
    assignTaskWithRelatedTasks(task, user);
  }

  
  const assignSelectedTasks = (selectedTasks) => {
    const selectedTasksIds = selectedTasks.map((task) => task['@id'])
    console.log('selectedTasks', selectedTasksIds)
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  const _bulkAssign = (user, selectedTasks) => {
    bulkAssignTasksWithRelatedTasks(selectedTasks, user);
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
          onMultipleSelectionAction={selectedTasks =>
            assignSelectedTasks(selectedTasks)
          }
        />
      </Box>
    </Box>)
}
