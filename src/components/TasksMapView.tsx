import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import TaskMarker from './TaskMarker';
import { filterTasks } from '../redux/logistics/utils';
import { getTaskListTasks } from '../shared/src/logistics/redux/taskListUtils';
import {
  selectIsHideUnassignedFromMap,
} from '../redux/Courier';
import { selectTasksEntities } from '../shared/logistics/redux';

import {
  BottomSheetContext,
} from '@/components/ui/bottomsheet';
import TasksBottomSheetContent from './TasksBottomSheetContent';
import { darkMapStyle, lightMapStyle } from "../styles/mapStyles"
import TaskListPolylines from './TaskListPolylines';

function TasksMapView(props) {
  const {
    mapCenter,
    onMapReady,
    onListedTaskPress,
    taskLists = [],
    uiFilters,
    tasksEntities,
    isHideUnassignedFromMap,
    mode = 'system',
  } = props;

  const [marginBottom, setMarginBottom] = useState(1);
  const mapRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(0);

  //bottomsheet opening
  const { handleOpen } = useContext(BottomSheetContext || {});
  const [modalMarkers, setModalMarkers] = useState([]);


  const colorScheme = useColorScheme();

  const activeMode = mode === 'system' ? colorScheme : mode;

  const mapStyle = useMemo(() => {
    return activeMode === 'dark' ? darkMapStyle : lightMapStyle;
  }, [activeMode]);

  const onMarkerPress = useCallback(
    (tasksAtLocation) => {
      setModalMarkers(tasksAtLocation);
      if (handleOpen) handleOpen();
    },
    [handleOpen]
  );

  // filtered data
  const data = useMemo(() => {
    return _.flatMap(taskLists, (taskList) => {
      if (isHideUnassignedFromMap && taskList.isUnassignedTaskList)
        return [];
      const tasks = getTaskListTasks(taskList, tasksEntities);
      const filtered = uiFilters ? filterTasks(tasks, uiFilters) : tasks;
      return filtered.map((task) => ({
        ...task,
        location: task.address.geo,
        taskList,
      }));
    });
  }, [taskLists, tasksEntities, uiFilters, isHideUnassignedFromMap]);

  const groupedByCoord = useMemo(() => {
    return _.groupBy(data, (task) => {
      const { latitude, longitude } = task.address.geo;
      return `${latitude.toFixed(5)}_${longitude.toFixed(5)}`;
    });
  }, [data]);


  //markers render
  const renderMarkers = useMemo(() => {
    return Object.values(groupedByCoord).map((tasks) => {
      const ids = tasks.map(t => t.id).sort((a, b) => a - b);
      const key = `taskmarker-${ids.join(',')}`;
      const firstTask = tasks[0];
      const { latitude, longitude } = firstTask.address.geo;

      return (
        <Marker
          key={key}
          coordinate={{ latitude, longitude }}
          onPress={() => onMarkerPress(tasks)}
          tracksViewChanges={false}
        >
          <TaskMarker
            task={firstTask}
            count={tasks.length}
            testID={key}
          />
        </Marker>
      );
    });
  }, [groupedByCoord, onMarkerPress]);
  ;

  // render bottomsheet
  const renderBottomSheet = useCallback(() => {
    if (!modalMarkers || modalMarkers.length === 0) return null;
    return (
      <TasksBottomSheetContent
        modalMarkers={modalMarkers}
        onListedTaskPress={onListedTaskPress}
      />
    ); },[modalMarkers, onListedTaskPress]);

  // map render
  return (
    <>
      <View
        renderToHardwareTextureAndroid={true}
        collapsable={false}
        style={{ flex: 1 }}
        onLayout={(e) => setMapHeight(e.nativeEvent.layout.height)}
      >
        {mapHeight > 0 && (
          <MapView
            customMapStyle={mapStyle}
            ref={mapRef}
            style={{ flex: 1, marginBottom }}
            initialRegion={{
              latitude: mapCenter[0],
              longitude: mapCenter[1],
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onMapReady={() => {
              setMarginBottom(0);
              if (onMapReady) onMapReady();
            }}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
          >
            <TaskListPolylines
              taskLists={taskLists}
            />
            {renderMarkers}
          </MapView>
        )}
      </View>
      {renderBottomSheet()}
    </>
  );
}

function mapStateToProps(state) {
  return {
    isHideUnassignedFromMap: selectIsHideUnassignedFromMap(state),
    tasksEntities: selectTasksEntities(state),
  };
}

export default connect(mapStateToProps)(withTranslation()(TasksMapView));
