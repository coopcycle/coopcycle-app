import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getTaskTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { mediumGreyColor } from '../../styles/common';
import { navigateToTask } from '../utils';
import { selectSelectedDate, selectTaskLists } from '../../shared/logistics/redux';
import { selectSettingsLatLng } from '../../redux/App/selectors';
import { useAllTasks } from './useAllTasks';
import AddButton from './components/AddButton';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import TasksMapView from '../../components/TasksMapView';


const styles = StyleSheet.create({
  newDeliveryBar: {
    backgroundColor: mediumGreyColor,
  },
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

export default function TasksMap({
  navigation,
  route,
}) {
  const allTaskLists = useSelector(selectTaskLists);
  const defaultCoordinates = useSelector(selectSettingsLatLng);
  const selectedDate = useSelector(selectSelectedDate);

  const {
    isFetching,
  } = useAllTasks(selectedDate);

  const mapCenter = useMemo(() => {
    return defaultCoordinates.split(',').map(parseFloat);
  }, [defaultCoordinates]);

  const navigateToSelectedTask = (task) => {
    const taskList = getTaskTaskList(task, allTaskLists);
    // task is one the the task lists' tasks, so taskList is always defined
    navigateToTask(navigation, route, task, taskList.items)
  }


  return (
    <BasicSafeAreaView>
      <View style={styles.newDeliveryBar}>
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
          taskLists={allTaskLists}
          onMarkerCalloutPress={navigateToSelectedTask}
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
    </BasicSafeAreaView>
  )
}
