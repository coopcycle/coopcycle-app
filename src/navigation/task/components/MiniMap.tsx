import React from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import TaskMarker from '../../../components/TaskMarker';
import { getCoordinates, getRegionForTasks } from './mapUtils';
import Task from '../../../types/task';
import Tasks from '../../../types/tasks';

const zoomLevel = 15;

export interface MiniMapProps {
  task?: Task;
  tasks: Tasks;
  onLayout?: (event: LayoutChangeEvent) => void;
  aspectRatio?: number;
}
const MiniMap: React.FC<MiniMapProps> = ({
  task,
  tasks,
  onLayout,
  aspectRatio,
}) => {
  // @see https://stackoverflow.com/questions/46568465/convert-a-region-latitudedelta-longitudedelta-into-an-approximate-zoomlevel/

  const region = getRegionForTasks(
    task ? [task] : tasks,
    zoomLevel,
    aspectRatio,
  );

  const renderPolyline = () => {
    const firstTask = tasks[0];
    const key = `polyline-${firstTask.id}`;
    const coords = getCoordinates(tasks);

    return (
      <Polyline
        key={key}
        testID={key}
        coordinates={coords}
        strokeWidth={3}
        strokeColor={firstTask.color}
        lineDashPattern={!firstTask.isAssigned ? [20, 10] : undefined}
      />
    );
  };

  return (
    <MapView
      style={styles.map}
      zoomEnabled
      showsUserLocation
      loadingEnabled
      loadingIndicatorColor={'#666666'}
      loadingBackgroundColor={'#eeeeee'}
      initialRegion={region}
      region={region}
      onLayout={onLayout}>
      {tasks.map(t => {
        return (
          <Marker
            identifier={t['@id']}
            key={t['@id']}
            coordinate={t.address.geo}
            flat={true}>
            <TaskMarker task={t} />
          </Marker>
        );
      })}
      {renderPolyline()}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MiniMap;
