import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { IncidentIcon, DoneIcon } from '../task/styles/common';
import { blueColor, greenColor, yellowColor } from '../../styles/common';
import {
  navigateToCompleteTask,
  navigateToOrder,
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
import { CourierProvider } from './contexts/CourierContext';

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
  const courierTaskList = useMemo(() => {
    const taskList = createCurrentTaskList(tasks);
    // Override color for courier
    taskList.color = blueColor;

    return taskList;
  }, [tasks]);

  const containerStyle = [styles.container];
  if (tasks.length === 0) {
    containerStyle.push(styles.containerEmpty);
  }

  const { isFetching, refetch } = useGetMyTasksQuery(
    selectedDate.format('YYYY-MM-DD') as DateOnlyString,
    {
      refetchOnFocus: true,
    },
  );

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = {
    onPressLeft: task =>
      navigateToCompleteTask(navigation, route, task, [], true),
    swipeOutLeftBackgroundColor: greenColor,
    swipeOutLeftEnabled: allowToSelect,
    swipeOutLeftIcon: DoneIcon,
  };

  const swipeRightConfiguration = {
    onPressRight: task =>
      navigateToCompleteTask(navigation, route, task, [], false),
    swipeOutRightBackgroundColor: yellowColor,
    swipeOutRightEnabled: allowToSelect,
    swipeOutRightIcon: IncidentIcon,
  };

  const completeSelectedTasks = selectedTasks => {
    if (selectedTasks.length > 1) {
      navigateToCompleteTask(navigation, route, null, selectedTasks, true);
    } else if (selectedTasks.length === 1) {
      navigateToCompleteTask(navigation, route, selectedTasks[0], [], true);
    }
  };

  return (
    <CourierProvider>
    <View style={containerStyle}>
      <DateSelectHeader navigate={navigation.navigate} />
      {tasks.length > 0 && (
        <TaskList
          id="courierTaskList"
          // We use `courierTaskList.items` here so each task has the properties added at `createCurrentTaskList`
          tasks={courierTaskList.items}
          refreshing={isFetching}
          onRefresh={() => refetch()}
          onTaskClick={task =>
            navigateToTask(navigation, route, task, courierTaskList.items)
          }
          onOrderClick={task =>
            navigateToOrder(navigation, getOrderNumber(task), true)
          }
          {...swipeLeftConfiguration}
          {...swipeRightConfiguration}
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
    </CourierProvider>
  );
}
