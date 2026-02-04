import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import {
  ActivityIndicator,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Component, useMemo, useCallback, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import RNPinScreen from 'react-native-pin-screen';
import { useFocusEffect } from '@react-navigation/native';

import { blueColor } from '../../styles/common';
import { connectCentrifugo } from '../../redux/middlewares/CentrifugoMiddleware/actions';
import { createCurrentTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { navigateToTask } from '../../navigation/utils';
import {
  selectFilteredTasks,
  selectKeepAwake,
  selectTaskSelectedDate,
  selectTaskFilters,
} from '../../redux/Courier';
import {
  selectIsCentrifugoConnected,
  selectSettingsLatLng,
} from '../../redux/App/selectors';
import { useGetMyTasksQuery } from '../../redux/api/slice';
import DateSelectHeader from '../../components/DateSelectHeader';
import TasksMapView from '../../components/TasksMapView';
import { DateOnlyString } from '../../utils/date-types';
import { BottomSheet } from '@/components/ui/bottomsheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    margin: 8,
  },
  activityIndicator: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

function enableKeepAwake() {
  if (Platform.OS === 'ios') {
    activateKeepAwakeAsync();
  } else {
    RNPinScreen.pin();
  }
}

function disableKeepAwake() {
  if (Platform.OS === 'ios') {
    deactivateKeepAwake();
  } else {
    RNPinScreen.unpin();
  }
}

function TaskMapPage({
  navigation,
  route,
  isCentrifugoConnected,
  keepAwake,
  connectCent
}) {

  const selectedDate = useSelector(selectTaskSelectedDate);
  const tasks = useSelector(selectFilteredTasks);
  const latlng = useSelector(selectSettingsLatLng);
  const uiFilters = useSelector(selectTaskFilters);

  const courierTaskLists = useMemo(() => {
    const taskList = createCurrentTaskList(tasks);
    // Override color for courier
    taskList.color = blueColor;
    taskList.items = taskList.items.map(task => ({
      ...task,
      color: blueColor,
    }));

    return [taskList];
  }, [tasks]);

  const mapCenter = useMemo(() => {
    return latlng.split(',').map(parseFloat);
  }, [latlng]);

  const { isFetching } = useGetMyTasksQuery(
    selectedDate.format('YYYY-MM-DD') as DateOnlyString,
    {
      refetchOnFocus: true,
    },
  );

  const taskListItems = courierTaskLists[0].items;

  const navigateToSelectedTask = useCallback((task) => {
    // We use `courierTaskList.items` here so each task has the properties added at `createCurrentTaskList`
    navigateToTask(navigation, route, task, taskListItems)
  }, [navigation, route, taskListItems]);

  useEffect(() => {
    if (!isCentrifugoConnected) {
      connectCent()
    }
  }, [isCentrifugoConnected, connectCent]);

  useFocusEffect(
    useCallback(() => {
      if (keepAwake) {
        enableKeepAwake();
      } else {
        disableKeepAwake();
      }
      // Cleanup when the screen is focused
      return () => {
        disableKeepAwake()
      };
    }, [keepAwake])
  );

  return (
    <View style={styles.container}>
      <DateSelectHeader navigate={navigation.navigate} />
      <View style={{ flex: 1 }}>
        <BottomSheet>
          <TasksMapView
            mapCenter={mapCenter}
            taskLists={courierTaskLists}
            onListedTaskPress={navigateToSelectedTask}
            uiFilters={uiFilters}
          />
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
    </View>
  );
}

function mapStateToProps(state) {
  return {
    keepAwake: selectKeepAwake(state),
    isCentrifugoConnected: selectIsCentrifugoConnected(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    connectCent: () => dispatch(connectCentrifugo()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TaskMapPage));
