import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getTaskTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { navigateToTask } from '../utils';
import { selectSettingsLatLng } from '../../redux/App/selectors';
import {
  selectSelectedDate,
  selectTaskLists,
  selectUnassignedTasksNotCancelled,
} from '../../shared/logistics/redux';
import { selectDispatchUiTaskFilters } from '../../redux/Dispatch/selectors';
import { useAllTasks } from './useAllTasks';
import { useBackgroundHighlightColor } from '../../styles/theme';
import AddButton from './components/AddButton';
import TasksMapView from '../../components/TasksMapView';
import { UNASSIGNED_TASKS_LIST_ID } from '../../shared/src/constants';
import { darkGreyColor } from '../../styles/common';

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
  const allUnassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const defaultCoordinates = useSelector(selectSettingsLatLng);
  const selectedDate = useSelector(selectSelectedDate);
  const bgHighlightColor = useBackgroundHighlightColor()

  const { isFetching } = useAllTasks(selectedDate);

  const mapCenter = useMemo(() => {
    return defaultCoordinates.split(',').map(parseFloat);
  }, [defaultCoordinates]);

  const mergedTaskListsWithUnassigned = useMemo(() => {
    return [
      // Prepend the unassigned tasks list
      {
        id: UNASSIGNED_TASKS_LIST_ID,
        '@id': UNASSIGNED_TASKS_LIST_ID,
        items: allUnassignedTasks,
        color: darkGreyColor,
      },
      ...allTaskLists
    ];
  }, [allTaskLists, allUnassignedTasks]);

  const navigateToSelectedTask = task => {
    const taskList = getTaskTaskList(task, mergedTaskListsWithUnassigned);
    // task is one the the task lists' tasks, so taskList is always defined
    navigateToTask(navigation, route, task, taskList.items);
  };

  return (
    <>
      <View style={{backgroundColor: bgHighlightColor}}>
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={styles.newDeliveryBarDate}>
            {selectedDate.format('ll')}
          </Text>
        </AddButton>
      </View>
      <View style={styles.mapContainer}>
        <TasksMapView
          mapCenter={mapCenter}
          taskLists={mergedTaskListsWithUnassigned}
          onMarkerCalloutPress={navigateToSelectedTask}
          uiFilters={uiFilters}
        />
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
