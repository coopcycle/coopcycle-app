import { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { DoneIcon, IncidentIcon } from '../task/styles/common';
import { blueColor, greenColor, yellowColor } from '../../styles/common';
import {
  navigateToCompleteTask,
  navigateToOrder,
  navigateToReportTask,
  navigateToTask,
} from '../../navigation/utils';
import {
  selectFilteredTasks,
  selectTaskSelectedDate,
} from '../../redux/Courier';
import { useGetMyTasksQuery } from '../../redux/api/slice';
import DateSelectHeader from '../../components/DateSelectHeader';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import { getOrderNumber } from '../../utils/tasks';
import { createCurrentTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { DateOnlyString } from '../../utils/date-types';
import { useTaskLongPress } from '../dispatch/hooks/useTaskLongPress';
import { useTaskListsContext } from './contexts/TaskListsContext';

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
  const context = useTaskListsContext();
  const selectedDate = useSelector(selectTaskSelectedDate);
  const tasks = useSelector(selectFilteredTasks);
  const courierTaskList = useMemo(() => {
    const taskList = createCurrentTaskList(tasks);
    // Override color for courier
    taskList.color = blueColor;

    return taskList;
  }, [tasks]);

  const isEditMode = context?.isEditMode;
  const clearSelectedTasks = context?.clearSelectedTasks;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isEditMode) {
        clearSelectedTasks?.();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isEditMode, clearSelectedTasks]);

  const containerStyle = [styles.container];
  if (tasks.length === 0) {
    containerStyle.push(styles.containerEmpty);
  }

  const { isFetching, refetch } = useGetMyTasksQuery(
    selectedDate.format('YYYY-MM-DD') as DateOnlyString,
    {
      refetchOnFocus: true,
      // Serve a date we already hold if it was loaded in the last 30s, so
      // hopping between dates (or remounting) doesn't refetch the whole list
      // every time.
      refetchOnMountOrArgChange: 30,
    },
  );

  const longPressHandler = useTaskLongPress();

  // These are handed down to every row, so they have to keep a stable
  // identity — otherwise the memoized rows re-render on every render of
  // this screen.
  const onPressLeft = useCallback(
    task => navigateToCompleteTask(navigation, route, task),
    [navigation, route],
  );

  const onPressRight = useCallback(
    task => navigateToReportTask(navigation, route, task),
    [navigation, route],
  );

  const onTaskClick = useCallback(
    task => navigateToTask(navigation, route, task, courierTaskList.items),
    [navigation, route, courierTaskList.items],
  );

  const onOrderClick = useCallback(
    task => navigateToOrder(navigation, getOrderNumber(task), true, task.status),
    [navigation],
  );

  const onRefresh = useCallback(() => {
    context?.clearSelectedTasks();
    refetch();
  }, [context, refetch]);

  const completeSelectedTasks = useCallback(
    selectedTasks => {
      if (selectedTasks.length > 1) {
        navigateToCompleteTask(navigation, route, null, selectedTasks);
      } else if (selectedTasks.length === 1) {
        navigateToCompleteTask(navigation, route, selectedTasks[0]);
      }
    },
    [navigation, route],
  );

  return (
    <View style={containerStyle}>
      <DateSelectHeader navigate={navigation.navigate} />
      {tasks.length > 0 && (
        <TaskList
          id="courierTaskList"
          // We use `courierTaskList.items` here so each task has the properties added at `createCurrentTaskList`
          tasks={courierTaskList.items}
          refreshing={isFetching}
          onRefresh={onRefresh}
          onTaskClick={onTaskClick}
          onOrderClick={onOrderClick}
          onLongPress={longPressHandler}
          onPressLeft={onPressLeft}
          swipeOutLeftBackgroundColor={greenColor}
          swipeOutLeftIcon={DoneIcon}
          onPressRight={onPressRight}
          swipeOutRightBackgroundColor={yellowColor}
          swipeOutRightIcon={IncidentIcon}
          onMultipleSelectionAction={completeSelectedTasks}
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
