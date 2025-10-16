import React, { useCallback } from 'react';
import { Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { decode } from '@mapbox/polyline';

import { lightGreyColor } from '../styles/common';
import { getTaskListTasks } from '../shared/src/logistics/redux/taskListUtils';
import { selectTasksEntities } from '../shared/logistics/redux';
import {
    selectIsHideUnassignedFromMap,
    selectIsPolylineOn
} from '../redux/Courier';
import { UNASSIGNED_TASKS_LIST_ID } from '../shared/src/constants';

type TaskListPolylinesProps = {
    taskLists: object[]; // @TODO We should define a TaskList type
    unassignedPolylineColor?: string;
};


const TaskListPolylines: React.FC<TaskListPolylinesProps> = ({
    taskLists,
    unassignedPolylineColor,
}) => {
    const isHideUnassignedFromMap = useSelector(selectIsHideUnassignedFromMap);
    const isPolylineOn = useSelector(selectIsPolylineOn);
    const tasksEntities = useSelector(selectTasksEntities);

    /**
     * Decode or compute the coordinates of a polyline for a task list.
     */
    const getCoordinates = useCallback(
        (taskList: object) => {
            if (taskList.polyline) {
                const decoded = decode(taskList.polyline).map(coords => ({
                    latitude: coords[0],
                    longitude: coords[1],
                }));
                return decoded;
            }

            const taskListTasks = getTaskListTasks(taskList, tasksEntities);
            return taskListTasks.map(task => task.address.geo);
        },
        [tasksEntities],
    );

    /**
     * Render all the polylines for the given task lists.
     */
    const renderPolylines = useCallback(() => {
        if (!isPolylineOn) return null;

        return taskLists.map((taskList, index) => {
            // Skip hidden unassigned routes
            if (isHideUnassignedFromMap && taskList.id === UNASSIGNED_TASKS_LIST_ID) {
                return null;
            }

            const key = `polyline-${taskList.id}-${index}`;
            const coordinates = getCoordinates(taskList);

            // Skip invalid or empty coordinate sets
            if (!coordinates || coordinates.length < 2) return null;

            const strokeColor = taskList.isUnassignedTaskList
                ? unassignedPolylineColor || lightGreyColor
                : taskList.color;

            return (
                <Polyline
                    key={key}
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
