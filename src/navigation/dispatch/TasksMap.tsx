import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import {
  createUnassignedTaskLists,
  getTaskListByTask,
  getTaskListTasks,
} from '../../shared/src/logistics/redux/taskListUtils';
import { navigateToTask } from '../utils';
import { selectSettingsLatLng } from '../../redux/App/selectors';
import {
  selectSelectedDate,
  selectTaskLists,
  selectTasksEntities,
  selectUnassignedTasksNotCancelled,
} from '../../shared/logistics/redux';
import { selectDispatchUiTaskFilters } from '../../redux/Dispatch/selectors';
import { useAllTasks } from './useAllTasks';
import AddButton from './components/AddButton';
import TasksMapView from '../../components/TasksMapView';
import { BottomSheet } from '@/components/ui/bottomsheet';

const styles = StyleSheet.create({
  newDeliveryBarDate: {
    fontWeight: '700',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  activityContainer: {
    alignItems: 'center',
    display: 'flex',
    left: 0,
    margin: 8,
    position: 'absolute',
    right: 0,
  },
  activityIndicator: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
});

export default function TasksMap({ navigation, route }) {
  const uiFilters = useSelector(selectDispatchUiTaskFilters);
  const allTaskLists = useSelector(selectTaskLists);
  const tasksEntities = useSelector(selectTasksEntities);
  const allUnassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const defaultCoordinates = useSelector(selectSettingsLatLng);
  const selectedDate = useSelector(selectSelectedDate);

  const { isFetching } = useAllTasks(selectedDate);

  // Unmount the native map (and its continuous GPS / rendering) whenever this
  // screen isn't focused — i.e. when the task/PoD stack is pushed on top or the
  // list tab is active — so it doesn't churn in the background. Scoped to this
  // screen; no global screen freezing (which caused a thaw-flicker elsewhere).
  const isFocused = useIsFocused();

  const mapCenter = useMemo(() => {
    return defaultCoordinates.split(',').map(parseFloat);
  }, [defaultCoordinates]);

  const mergedTaskListsWithUnassigned = useMemo(() => {
    // Split the unassigned task list by grouped linked tasks
    const allUnassignedTaskLists =
      createUnassignedTaskLists(allUnassignedTasks);
    // Prepend the unassigned tasks list
    return allUnassignedTaskLists.concat(allTaskLists);
  }, [allTaskLists, allUnassignedTasks]);

  const navigateToSelectedTask = task => {
    // Task is one the the task lists' tasks, so taskList is always defined
    const taskList = getTaskListByTask(task, mergedTaskListsWithUnassigned);
    const relatedTasks = getTaskListTasks(taskList, tasksEntities);
    navigateToTask(navigation, route, task, relatedTasks);
  };

  return (
    <>
      <Box className="bg-background-100">
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={styles.newDeliveryBarDate}>
            {selectedDate.format('ll')}
          </Text>
        </AddButton>
      </Box>
      <View style={styles.mapContainer}>
        <BottomSheet>
          {isFocused ? (
            <TasksMapView
              mapCenter={mapCenter}
              taskLists={mergedTaskListsWithUnassigned}
              uiFilters={uiFilters}
              onListedTaskPress={navigateToSelectedTask}
            />
          ) : null}
        </BottomSheet>
        {isFetching ? (
          <View style={styles.activityContainer}>
            <ActivityIndicator
              style={styles.activityIndicator}
              animating={true}
              size="large"
            />
          </View>
        ) : null}
      </View>
    </>
  );
}
