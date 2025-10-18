import React, { useCallback } from 'react';
import { Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { decode } from '@mapbox/polyline';

import { useSecondaryTextColor } from '../styles/theme';

import { getTaskListTasks } from '../shared/src/logistics/redux/taskListUtils';
import { selectTasksEntities } from '../shared/logistics/redux';
import {
    selectIsHideUnassignedFromMap,
    selectIsPolylineOn
} from '../redux/Courier';

type TaskListPolylinesProps = {
    taskLists: object[]; // @TODO We should define a TaskList type
};


const TaskListPolylines: React.FC<TaskListPolylinesProps> = ({
    taskLists
}) => {
  const unassignedPolylineColor = useSecondaryTextColor();
  const isHideUnassignedFromMap = useSelector(selectIsHideUnassignedFromMap);
  const isPolylineOn = useSelector(selectIsPolylineOn);
  const tasksEntities = useSelector(selectTasksEntities);

  /**
   * Decode or compute the coordinates of a polyline for a task list.
   */
  const getCoordinates = useCallback(
    (taskList: object) => {
      if (taskList.polyline) {
        try {
          return decode(taskList.polyline).map(([latitude, longitude]) => ({
            latitude,
            longitude,
          }));
        } catch {
          return [];
        }
      }
      const tasks = getTaskListTasks(taskList, tasksEntities);
      return tasks.map(t => t.address.geo);
    },
    [tasksEntities]
  );

  /**
   * Render all the polylines for the given task lists.
   */
  const renderPolylines = useCallback(() => {
    if (!isPolylineOn) return null;

    return taskLists.map((taskList, index) => {
      // Skip hidden unassigned routes
      if (isHideUnassignedFromMap && taskList.isUnassignedTaskList) {
        return null;
      }

      const key = `polyline-${taskList.id}-${index}`;
      const coordinates = getCoordinates(taskList);

      // Skip invalid or empty coordinate sets
      if (!coordinates || coordinates.length < 2) return null;

      const strokeColor = taskList.isUnassignedTaskList
          ? unassignedPolylineColor
          : taskList.color;

      return (
        <Polyline
          key={key}
          testID={key}
          coordinates={coordinates}
          strokeWidth={2}
          strokeColor={strokeColor}
          lineDashPattern={taskList.isUnassignedTaskList ? [20, 10] : undefined}
        />
      );
    });
  }, [taskLists, getCoordinates, isPolylineOn, isHideUnassignedFromMap, unassignedPolylineColor]);

  return <>{renderPolylines()}</>;
};

export default TaskListPolylines;
