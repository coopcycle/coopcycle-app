import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';

import ItemSeparatorComponent from './ItemSeparator';
import ItemsBulkFabButton from './ItemsBulkFabButton';
import TaskListItem from './TaskListItem';

const TaskList = ({
  id,
  multipleSelectionIcon,
  onMultipleSelectionAction,
  onRefresh = () => {},
  onPressLeft = () => {},
  onPressRight = () => {},
  onSwipeClosed = () => {},
  onSwipeToLeft = () => {},
  onSwipeToRight = () => {},
  onTaskClick = () => {},
  refreshing = false,
  swipeOutLeftBackgroundColor,
  swipeOutLeftEnabled,
  swipeOutLeftIconName,
  swipeOutRightBackgroundColor,
  swipeOutRightEnabled,
  swipeOutRightIconName,
  tasks,
  tasksWithColor,
}) => {
  const bulkFabButton = useRef(null);

  const taskColor = (task) => {
    let tasksWithColorSafe = tasksWithColor ?? [];
    return Object.prototype.hasOwnProperty.call(tasksWithColorSafe, task['@id'])
      ? tasksWithColor[task['@id']]
      : '#ffffff';
  };

  const swipeLeftConfiguration = (task) => ({
    disableLeftSwipe: !swipeOutLeftEnabled(task),
    onPressLeft: () => onPressLeft(task),
    onSwipedToLeft: () => _handleSwipeToLeft(task),
    swipeOutLeftBackgroundColor,
    swipeOutLeftIconName,
  });

  const swipeRightConfiguration = (task) => ({
    disableRightSwipe: !swipeOutRightEnabled(task),
    onPressRight: () => onPressRight(task),
    onSwipeClosed: () => _handleSwipeClosed(task),
    onSwipedToRight: () => _handleSwipeToRight(task),
    swipeOutRightBackgroundColor,
    swipeOutRightIconName,
  });

  const _handleSwipeToLeft = useCallback((task) => {
    bulkFabButton.current?.addItem(task);
    onSwipeToLeft(task);
  }, [onSwipeToLeft]);

  const _handleSwipeToRight = useCallback((task) => {
    onSwipeToRight(task);
  }, [onSwipeToRight]);

  const _handleSwipeClosed = useCallback((task) => {
    bulkFabButton.current?.removeItem(task);
    onSwipeClosed(task);
  }, [onSwipeClosed]);

  const onFabButtonPressed = (items) => {
    onMultipleSelectionAction(items);
  };

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
        taskListId={id}
        onPress={() => onTaskClick(item)}
        {...swipeLeftConfiguration(item)}
        {...swipeRightConfiguration(item)}
      />
    );
  };

  return (
    <>
      <SwipeListView
        data={tasks}
        keyExtractor={(item, index) => item['@id']}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      {multipleSelectionIcon && onFabButtonPressed && (
        <ItemsBulkFabButton
          iconName={multipleSelectionIcon}
          onPressed={(items) => onFabButtonPressed(items)}
          ref={bulkFabButton}
        />
      )}
    </>
  );
};

TaskList.propTypes = {
  id: PropTypes.string.isRequired,
  multipleSelectionIcon: PropTypes.string,
  onMultipleSelectionAction: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  onSwipeClosed: PropTypes.func,
  onSwipeToLeft: PropTypes.func,
  onSwipeToRight: PropTypes.func,
  onTaskClick: PropTypes.func.isRequired,
  swipeOutLeftBackgroundColor: PropTypes.string,
  swipeOutLeftEnabled: PropTypes.func,
  swipeOutLeftIconName: PropTypes.string,
  swipeOutRightBackgroundColor: PropTypes.string,
  swipeOutRightEnabled: PropTypes.func,
  swipeOutRightIconName: PropTypes.string,
  tasks: PropTypes.array.isRequired,
  tasksWithColor: PropTypes.object,
};

export default TaskList;
