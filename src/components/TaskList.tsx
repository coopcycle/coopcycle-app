import { SwipeListView } from 'react-native-swipe-list-view';
import React, { useCallback, useEffect, useRef } from 'react';

import ItemsBulkFabButton from './ItemsBulkFabButton';
import ItemSeparatorComponent from './ItemSeparator';
import TaskListItem from './TaskListItem';
import Task, { TaskListProps } from '../types/task';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';

const TaskList: React.FC<TaskListProps> = ({
  id,
  onMultipleSelectionAction,
  onRefresh = () => {},
  onPressLeft = () => {},
  onPressRight = () => {},
  onSwipeClosed = () => {},
  onSwipeToLeft = () => {},
  onSwipeToRight = () => {},
  onLongPress = () => {},
  onTaskClick = () => {},
  onOrderClick = () => {},
  refreshing = false,
  swipeOutLeftBackgroundColor,
  swipeOutLeftIcon,
  swipeOutRightBackgroundColor,
  swipeOutRightIcon,
  tasks,
  appendTaskListTestID = '',
}) => {
  const bulkFabButton = useRef(null);

  const swipeLeftConfiguration = (task: Task) => ({
    onPressLeft: () => onPressLeft(task),
    onSwipedToLeft: () => _handleSwipeToLeft(task),
    swipeOutLeftBackgroundColor,
    swipeOutLeftIcon,
  });

  const swipeRightConfiguration = (task: Task) => ({
    onPressRight: () => onPressRight(task),
    onSwipeClosed: () => _handleSwipeClosed(task),
    onSwipedToRight: () => _handleSwipeToRight(task),
    swipeOutRightBackgroundColor,
    swipeOutRightIcon,
  });

  const _handleSwipeToLeft = useCallback(
    (task: Task) => {
      bulkFabButton.current?.addItem(task);
      onSwipeToLeft(task);
    },
    [onSwipeToLeft],
  );

  const _handleSwipeToRight = useCallback(
    (task: Task) => {
      onSwipeToRight(task);
    },
    [onSwipeToRight],
  );

  const _handleSwipeClosed = useCallback(
    (task: Task) => {
      bulkFabButton.current?.removeItem(task);
      onSwipeClosed(task);
    },
    [onSwipeClosed],
  );

  // TODO Review this button with the incoming new design/layout..!
  // The use of context here is to avoid incorrectly being parsed in dispatch screen
  const context = useTaskListsContext();
  const isFromCourier = context && context.isFromCourier;
  const onFabButtonPressed = isFromCourier ? (items => {
    onMultipleSelectionAction(items);
  }) : null;

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
        isSelectedTask={tasks.includes(task)}
        onPress={() => onTaskClick(task)}
        onLongPress={onLongPress}
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
          return `${item['@id']}-${item.status}-${tagNames.length === 0 ? 'no_tag' : tagNames.join('-')}`;
        }}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={ItemSeparatorComponent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={3}
      />
      {onFabButtonPressed && (
        <ItemsBulkFabButton
          onPressed={onFabButtonPressed}
          ref={bulkFabButton}
        />
      )}
    </>
  );
};

export default TaskList;
