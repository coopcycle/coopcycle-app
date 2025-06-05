import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import React from 'react';

import { doneIconName, incidentIconName } from '../task/styles/common';
import { greenColor, yellowColor } from '../../styles/common';
import { navigateToCompleteTask, navigateToTask } from '../../navigation/utils';
import {
  selectFilteredTasks,
  selectTaskSelectedDate,
  selectTasksWithColor,
} from '../../redux/Courier';
import { useGetMyTasksQuery } from '../../redux/api/slice';
import DateSelectHeader from '../../components/DateSelectHeader';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';


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

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = {
    onSwipeLeft: task => navigateToCompleteTask(navigation, route, task, [], true),
    swipeOutLeftBackgroundColor: greenColor,
    swipeOutLeftEnabled: allowToSelect,
    swipeOutLeftIconName: doneIconName,
  };

  const swipeRightConfiguration = {
    onSwipeRight: task => navigateToCompleteTask(navigation, route, task, [], false),
    swipeOutRightBackgroundColor: yellowColor,
    swipeOutRightEnabled: allowToSelect,
    swipeOutRightIconName: incidentIconName,
  };

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
          refreshing={isFetching}
          onRefresh={() => refetch()}
          onTaskClick={task => navigateToTask(navigation, route, task, tasks)}
          {...swipeLeftConfiguration}
          {...swipeRightConfiguration}
          multipleSelectionIcon={doneIconName}
          onMultipleSelectionAction={completeSelectedTasks}
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
