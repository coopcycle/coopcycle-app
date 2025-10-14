import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import MapView, { Marker, Polyline, } from 'react-native-maps';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { decode } from '@mapbox/polyline';
import _ from 'lodash';
import TaskMarker from './TaskMarker';
import { filterTasks } from '../redux/logistics/utils';
import { getTaskListTasks } from '../shared/src/logistics/redux/taskListUtils';
import {
  selectIsHideUnassignedFromMap,
  selectIsPolylineOn,
} from '../redux/Courier';
import { selectTasksEntities } from '../shared/logistics/redux';
import { UNASSIGNED_TASKS_LIST_ID } from '../shared/src/constants';

import {
  BottomSheetContext,
} from '@/components/ui/bottomsheet';
import TasksBottomSheetContent from './TasksBottomSheetContent';
import { lightMapStyle, darkMapStyle } from "../styles/mapStyles"
const latitudeDelta = 0.0722;
const longitudeDelta = 0.0221;
import TaskListPolylines from './TaskListPolylines';

function TasksMapView(props) {
  const {
    mapCenter,
    onMapReady,
    taskLists = [],
    uiFilters,
    tasksEntities,
    isHideUnassignedFromMap,
    isPolylineOn,
    mode = 'system',
  } = props;

  const [marginBottom, setMarginBottom] = useState(1);
  const mapRef = useRef(null);
  const [latitude, longitude] = mapCenter || [0, 0];
  const initialRegion = { latitude, longitude, latitudeDelta, longitudeDelta };
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
      setModalMarkers(tasksAtLocation || []);
      if (handleOpen) handleOpen();
    },
    [handleOpen]
  );

  // filtered data
  const data = useMemo(() => {
    return _.flatMap(taskLists, (taskList) => {
      if (isHideUnassignedFromMap && taskList.id === UNASSIGNED_TASKS_LIST_ID)
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
    return Object.entries(groupedByCoord).map(([coordKey, tasks], i) => {
      const { latitude, longitude } = tasks[0].address.geo;
      const isCluster = tasks.length > 1;

      return (
        <Marker
          key={`marker-${coordKey}-${i}`}
          coordinate={{ latitude, longitude }}
          onPress={() => onMarkerPress(tasks)}
          tracksViewChanges={false}
        >
          <TaskMarker task={tasks[0]} count={isCluster ? tasks.length : undefined} />
        </Marker>
      );
    });
  }, [groupedByCoord, onMarkerPress]);

  //grouped markers
  const groupedTasks = useMemo(() => {
    const groups = {};

    taskLists.forEach(list => {
      if (!list) return;

      // get tasks from redux
      const tasks = getTaskListTasks(list, tasksEntities) || [];

      tasks.forEach(task => {
        if (!task?.address?.lat || !task?.address?.lng) return;
        const key = `${task.address.lat}-${task.address.lng}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(task);
      });
    });

    return groups;
  }, [taskLists, tasksEntities]);

  // render polylines
  const getPolylineCoords = (taskList) => {
    if (taskList.polyline) {
      try {
        return decode(taskList.polyline).map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
      } catch {
        return [];
      }
    }
    const tasks = getTaskListTasks(taskList, tasksEntities);
    return tasks.map((t) => t.address.geo);
  };


  // render bottomsheet
  const renderBottomSheet = useCallback(() => {
    const mainTask = modalMarkers[0];
    if (!modalMarkers || modalMarkers.length === 0) return null;

    return <TasksBottomSheetContent modalMarkers={modalMarkers} />;

  }, [modalMarkers]);

  const { width } = Dimensions.get('window');


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
          >
            <TaskListPolylines
              taskLists={taskLists}
              unassignedPolylineColor="rgba(49, 49, 49, 0.8)" 
            />
            {renderMarkers}
            {Object.values(groupedTasks).map((tasksAtLocation, i) => {
              const firstTask = tasksAtLocation[0];
              const color = firstTask.tags?.[0]?.color || '#1c1c1e';
              const coordinate = {
                latitude: firstTask.address.lat,
                longitude: firstTask.address.lng,
              };
              const label =
                tasksAtLocation.length > 1 ? `${tasksAtLocation.length}` : '';

              return (
                <Marker
                  key={i}
                  coordinate={coordinate}
                  onPress={() => onMarkerPress(tasksAtLocation)}
                >
                  <View
                    style={{
                      backgroundColor: color,
                      borderRadius: 20,
                      padding: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{label}</Text>
                  </View>
                </Marker>
              );
            })}
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
    isPolylineOn: selectIsPolylineOn(state),
    tasksEntities: selectTasksEntities(state),
  };
}

export default connect(mapStateToProps)(withTranslation()(TasksMapView));
