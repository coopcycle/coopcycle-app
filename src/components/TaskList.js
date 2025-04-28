import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';

import ItemSeparatorComponent from './ItemSeparator';
import ItemsBulkFabButton from './ItemsBulkFabButton';
import TaskListItem from './TaskListItem';

const TaskList = ({
  tasks,
  tasksType,
  tasksWithColor,
  onTaskClick,
  onSwipeLeft,
  onSwipeRight,
  swipeOutLeftEnabled,
  swipeOutRightEnabled,
  swipeOutLeftIconName,
  swipeOutRightIconName,
  multipleSelectionIcon,
  onMultipleSelectionAction,
}) => {
  const bulkFabButton = useRef(null);

  const taskColor = (task) => {
    let tasksWithColorSafe = tasksWithColor ?? [];
    return Object.prototype.hasOwnProperty.call(tasksWithColorSafe, task['@id'])
      ? tasksWithColor[task['@id']]
      : '#ffffff';
  };

  const _handleSwipeToLeft = useCallback((task) => {
    bulkFabButton.current?.addItem(task);
  }, []);

  const _handleSwipeClosed = useCallback((task) => {
    bulkFabButton.current?.removeItem(task);
  }, []);

  const onFabButtonPressed = useCallback(() => {
    onMultipleSelectionAction(tasks);
  }, [tasks, onMultipleSelectionAction]);

  // check this filter
  useEffect(() => {
    const doneTasks = tasks.filter(t => t.status !== 'DONE');
    bulkFabButton.current?.updateItems(doneTasks);
  }, [tasks]);

  const renderItem = ({ item, index }) => {
    return (
      <TaskListItem
        task={item}
        index={index}
        color={taskColor(item)}
        onPress={() => onTaskClick(item)}
        onPressLeft={() => onSwipeLeft(item)}
        onPressRight={() => onSwipeRight(item)}
        onSwipedToLeft={() => _handleSwipeToLeft(item)}
        onSwipeClosed={() => _handleSwipeClosed(item)}
        disableRightSwipe={tasksType === 'taskList'}
        disableLeftSwipe={tasksType === 'unassignedTasks'}
        swipeOutLeftIconName={swipeOutLeftIconName}
        swipeOutRightIconName={swipeOutRightIconName}
      />
    );
  };

  return (
    <>
      <SwipeListView
        data={tasks}
        keyExtractor={(item, index) => item['@id']}
        renderItem={renderItem}
        // handled globally
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <ItemsBulkFabButton
        iconName={multipleSelectionIcon}
        onPressed={(items) => onFabButtonPressed(items)}
        ref={bulkFabButton}
      />
    </>
  );
};

TaskList.defaultProps = {
  refreshing: false,
  onRefresh: () => {},
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  tasksWithColor: PropTypes.object,
  onTaskClick: PropTypes.func.isRequired,
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
  swipeOutLeftEnabled: PropTypes.func,
  swipeOutRightEnabled: PropTypes.func,
  swipeOutLeftIconName: PropTypes.string,
  swipeOutRightIconName: PropTypes.string,
  multipleSelectionIcon: PropTypes.string,
  onMultipleSelectionAction: PropTypes.func.isRequired,
};

export default TaskList;
