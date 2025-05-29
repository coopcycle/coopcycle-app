import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import DateSelectHeader from '../../components/DateSelectHeader';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import { navigateToCompleteTask, navigateToTask } from '../../navigation/utils';
import {
  selectFilteredTasks,
  selectTaskSelectedDate,
  selectTasksWithColor,
} from '../../redux/Courier';
import { doneIconName } from '../task/styles/common';
import { useGetMyTasksQuery } from '../../redux/api/slice';

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
  const selectedDate = useSelector(selectTaskSelectedDate);
  const tasks = useSelector(selectFilteredTasks);
  const tasksWithColor = useSelector(selectTasksWithColor);

  const containerStyle = [styles.container];
  if (tasks.length === 0) {
    containerStyle.push(styles.containerEmpty);
  }

  const { isFetching, refetch } = useGetMyTasksQuery(selectedDate, {
    refetchOnFocus: true,
  });

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
          onPressLeft={task =>
            navigateToCompleteTask(navigation, route, task, [], true)
          }
          onPressRight={task =>
            navigateToCompleteTask(navigation, route, task, [], false)
          }
          swipeOutLeftEnabled={task => task.status !== 'DONE'}
          swipeOutRightEnabled={task => task.status !== 'DONE'}
          onTaskClick={task => navigateToTask(navigation, route, task, tasks)}
          refreshing={isFetching}
          onRefresh={() => refetch()}
          allowMultipleSelection={task => allowToSelect(task)}
          multipleSelectionIcon={doneIconName}
          onMultipleSelectionAction={selectedTasks =>
            completeSelectedTasks(selectedTasks)
          }
          id="courierTaskList"
        />
      )}
      {tasks.length === 0 && (
        <>
          <ActivityIndicator
            style={{ paddingVertical: 8 }}
            animating={isFetching}
            size="large"
          />
          <TapToRefresh onPress={() => refetch()} />
        </>
      )}
    </View>
  );
}
