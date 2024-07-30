import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import DateSelectHeader from '../../components/DateSelectHeader';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import { navigateToCompleteTask, navigateToTask } from '../../navigation/utils';
import {
  loadTasks,
  selectFilteredTasks,
  selectIsTasksRefreshing,
  selectTaskSelectedDate,
  selectTasksWithColor,
} from '../../redux/Courier';
import { doneIconName } from '../task/styles/common';

const styles = StyleSheet.create({
  containerEmpty: {
    alignItems: 'center',
    paddingTop: 0,
  },
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
});

const allowToSelect = task => {
  return task.status !== 'DONE';
};

export default function TaskListPage({ navigation, route }) {
  const tasks = useSelector(selectFilteredTasks);
  const tasksWithColor = useSelector(selectTasksWithColor);
  const selectedDate = useSelector(selectTaskSelectedDate);
  const isRefreshing = useSelector(selectIsTasksRefreshing);

  const containerStyle = [styles.container];
  if (tasks.length === 0) {
    containerStyle.push(styles.containerEmpty);
  }

  const dispatch = useDispatch();

  const completeSelectedTasks = selectedTasks => {
    if (selectedTasks.length > 1) {
      navigateToCompleteTask(navigation, route, null, selectedTasks, true);
    } else if (selectedTasks.length === 1) {
      navigateToCompleteTask(navigation, route, selectedTasks[0], [], true);
    }
  };

  return (
    <View style={containerStyle}>
      <DateSelectHeader navigate={navigation.navigate} />
      {tasks.length > 0 && (
        <TaskList
          tasks={tasks}
          tasksWithColor={tasksWithColor}
          onSwipeLeft={task =>
            navigateToCompleteTask(navigation, route, task, [], true)
          }
          onSwipeRight={task =>
            navigateToCompleteTask(navigation, route, task, [], false)
          }
          swipeOutLeftEnabled={task => task.status !== 'DONE'}
          swipeOutRightEnabled={task => task.status !== 'DONE'}
          onTaskClick={task => navigateToTask(navigation, route, task, tasks)}
          refreshing={isRefreshing}
          onRefresh={() => dispatch(loadTasks(selectedDate, true))}
          allowMultipleSelection={task => allowToSelect(task)}
          multipleSelectionIcon={doneIconName}
          onMultipleSelectionAction={selectedTasks =>
            completeSelectedTasks(selectedTasks)
          }
        />
      )}
      {tasks.length === 0 && (
        <TapToRefresh onPress={() => dispatch(loadTasks(selectedDate))} />
      )}
    </View>
  );
}
