import React from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { Marker } from '@maplibre/maplibre-react-native';
import Map from '../../../components/map/Map';
import Polyline from '../../../components/map/Polyline';
import { toPosition } from '../../../components/map/region';
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
  mode?: 'light' | 'dark' | 'system';
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
    const coords = getCoordinates(tasks);
    if (coords.length === 0) {
      return null;
    }

    const firstTask = tasks[0];
    const key = `polyline-${firstTask.id}`;

    return (
      <Polyline
        id={key}
        coordinates={coords}
        strokeWidth={3}
        strokeColor={firstTask.color}
        lineDashPattern={!firstTask.isAssigned ? [20, 10] : undefined}
      />
    );
  };

  return (
    <Map
      style={styles.map}
      showsUserLocation
      initialRegion={region}
      region={region}
      onLayout={onLayout}>
      {tasks.map(t => {
        return (
          <Marker
            id={t['@id']}
            key={t['@id']}
            lngLat={toPosition(t.address.geo)}>
            <TaskMarker task={t} />
          </Marker>
        );
      })}
      {renderPolyline()}
    </Map>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MiniMap;
