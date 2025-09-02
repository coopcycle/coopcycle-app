import { SwipeListView } from 'react-native-swipe-list-view';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';

import ItemsBulkFabButton from './ItemsBulkFabButton';
import ItemSeparatorComponent from './ItemSeparator';
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
  onOrderClick = () => {},
  refreshing = false,
  swipeOutLeftBackgroundColor,
  swipeOutLeftIconName,
  swipeOutRightBackgroundColor,
  swipeOutRightIconName,
  tasks,
  appendTaskListTestID = '',
}) => {
  const bulkFabButton = useRef(null);

  const swipeLeftConfiguration = task => ({
    onPressLeft: () => onPressLeft(task),
    onSwipedToLeft: () => _handleSwipeToLeft(task),
    swipeOutLeftBackgroundColor,
    swipeOutLeftIconName,
  });

  const swipeRightConfiguration = task => ({
    onPressRight: () => onPressRight(task),
    onSwipeClosed: () => _handleSwipeClosed(task),
    onSwipedToRight: () => _handleSwipeToRight(task),
    swipeOutRightBackgroundColor,
    swipeOutRightIconName,
  });

  const _handleSwipeToLeft = useCallback(
    task => {
      bulkFabButton.current?.addItem(task);
      onSwipeToLeft(task);
    },
    [onSwipeToLeft],
  );

  const _handleSwipeToRight = useCallback(
    task => {
      onSwipeToRight(task);
    },
    [onSwipeToRight],
  );

  const _handleSwipeClosed = useCallback(
    task => {
      bulkFabButton.current?.removeItem(task);
      onSwipeClosed(task);
    },
    [onSwipeClosed],
  );

  const onFabButtonPressed = items => {
    onMultipleSelectionAction(items);
  };

  // check this filter
  useEffect(() => {
    const doneTasks = tasks.filter(t => t.status !== 'DONE');
    bulkFabButton.current?.updateItems(doneTasks);
  }, [tasks]);

  const renderItem = ({ item: task, index }) => {
    return (
      <TaskListItem
        taskListId={id}
        appendTaskListTestID={appendTaskListTestID}
        task={task}
        index={index}
        color={task.color}
        onPress={() => onTaskClick(task)}
        onOrderPress={() => onOrderClick(task)}
        {...swipeLeftConfiguration(task)}
        {...swipeRightConfiguration(task)}
      />
    );
  };

  return (
    <>
      <SwipeListView
        data={tasks}
        keyExtractor={(item, index) => {
          const tagNames = (item.tags || []).map(t => t.name);
          return `${item['@id']}-${tagNames.length === 0 ? 'no_tag' : tagNames.join('-')}`;
        }}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={ItemSeparatorComponent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={3}
      />
      {multipleSelectionIcon && onFabButtonPressed && (
        <ItemsBulkFabButton
          iconName={multipleSelectionIcon}
          onPressed={onFabButtonPressed}
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
  onOrderClick: PropTypes.func.isRequired,
  swipeOutLeftBackgroundColor: PropTypes.string,
  swipeOutLeftEnabled: PropTypes.func,
  swipeOutLeftIconName: PropTypes.string,
  swipeOutRightBackgroundColor: PropTypes.string,
  swipeOutRightEnabled: PropTypes.func,
  swipeOutRightIconName: PropTypes.string,
  tasks: PropTypes.array.isRequired,
};

export default TaskList;
