import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

import ItemsBulkFabButton from './ItemsBulkFabButton';
import ItemSeparatorComponent from './ItemSeparator';
import TaskListItem from './TaskListItem';
import Task, { TaskListProps } from '../types/task';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';

type TaskRowProps = {
  task: Task;
  nextTask: Task | null;
  index: number;
  taskListId: string;
  appendTaskListTestID: string;
  onTaskClick: (task: Task) => void;
  onOrderClick: (task: Task) => void;
  onLongPress: (task: Task) => void;
  onPressLeft: (task: Task) => void;
  onPressRight: (task: Task) => void;
  onSwipedToLeft: (task: Task) => void;
  onSwipedToRight: (task: Task) => void;
  onSwipeClosed: (task: Task) => void;
  onSort?: (index: number) => void;
  onSortBefore?: () => void;
  swipeOutLeftBackgroundColor?: string;
  swipeOutLeftIcon?: LucideIcon;
  swipeOutRightBackgroundColor?: string;
  swipeOutRightIcon?: LucideIcon;
};

/**
 * One row, memoized on its props.
 *
 * `TaskListItem` renders a swipeable with gesture handlers, so re-rendering
 * every visible row on every store update is expensive. All the per-task
 * closures are built *here* rather than in `renderItem`, so the row only
 * re-renders when its own task actually changes — the callbacks it receives
 * take the task as an argument and are stable across renders.
 */
const TaskRow = React.memo(function TaskRow({
  task,
  nextTask,
  index,
  taskListId,
  appendTaskListTestID,
  onTaskClick,
  onOrderClick,
  onLongPress,
  onPressLeft,
  onPressRight,
  onSwipedToLeft,
  onSwipedToRight,
  onSwipeClosed,
  onSort,
  onSortBefore,
  swipeOutLeftBackgroundColor,
  swipeOutLeftIcon,
  swipeOutRightBackgroundColor,
  swipeOutRightIcon,
}: TaskRowProps) {
  const handlePress = useCallback(() => onTaskClick(task), [onTaskClick, task]);
  const handleOrderPress = useCallback(
    () => onOrderClick(task),
    [onOrderClick, task],
  );
  const handlePressLeft = useCallback(
    () => onPressLeft(task),
    [onPressLeft, task],
  );
  const handlePressRight = useCallback(
    () => onPressRight(task),
    [onPressRight, task],
  );
  const handleSwipedToLeft = useCallback(
    () => onSwipedToLeft(task),
    [onSwipedToLeft, task],
  );
  const handleSwipedToRight = useCallback(
    () => onSwipedToRight(task),
    [onSwipedToRight, task],
  );
  const handleSwipeClosed = useCallback(
    () => onSwipeClosed(task),
    [onSwipeClosed, task],
  );
  const handleSort = useCallback(() => onSort?.(index), [onSort, index]);
  const handleSortBefore = useCallback(() => onSortBefore?.(), [onSortBefore]);

  return (
    <TaskListItem
      taskListId={taskListId}
      appendTaskListTestID={appendTaskListTestID}
      task={task}
      nextTask={nextTask}
      index={index}
      color={task.color}
      onPress={handlePress}
      onLongPress={onLongPress}
      onOrderPress={handleOrderPress}
      onSortBefore={onSortBefore ? handleSortBefore : undefined}
      onSort={onSort ? handleSort : undefined}
      onPressLeft={handlePressLeft}
      onSwipedToLeft={handleSwipedToLeft}
      swipeOutLeftBackgroundColor={swipeOutLeftBackgroundColor}
      swipeOutLeftIcon={swipeOutLeftIcon}
      onPressRight={handlePressRight}
      onSwipedToRight={handleSwipedToRight}
      onSwipeClosed={handleSwipeClosed}
      swipeOutRightBackgroundColor={swipeOutRightBackgroundColor}
      swipeOutRightIcon={swipeOutRightIcon}
    />
  );
});

const TaskList: React.FC<TaskListProps> = ({
  id,
  onMultipleSelectionAction = () => {},
  onRefresh = () => {},
  onPressLeft = () => {},
  onPressRight = () => {},
  onSwipeClosed = () => {},
  onSwipeToLeft = () => {},
  onSwipeToRight = () => {},
  onLongPress = () => {},
  onTaskClick = () => {},
  onOrderClick = () => {},
  onSort = undefined,
  onSortBefore = undefined,
  refreshing = false,
  swipeOutLeftBackgroundColor,
  swipeOutLeftIcon,
  swipeOutRightBackgroundColor,
  swipeOutRightIcon,
  tasks,
  appendTaskListTestID = '',
}) => {
  const bulkFabButton = useRef(null);

  // The sort callbacks need the current list, but making them depend on
  // `tasks` would invalidate every row on every list update.
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

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

  const _handleSort = useCallback(
    (index: number) => onSort?.(tasksRef.current, index),
    [onSort],
  );

  const _handleSortBefore = useCallback(
    () => onSortBefore?.(tasksRef.current),
    [onSortBefore],
  );

  // TODO Review this button with the incoming new design/layout..!
  // The use of context here is to avoid incorrectly being parsed in dispatch screen
  const context = useTaskListsContext();
  const isFromCourier = context && context.isFromCourier;
  const onFabButtonPressed = isFromCourier
    ? items => onMultipleSelectionAction(items)
    : null;

  // check this filter
  useEffect(() => {
    const doneTasks = tasks.filter(t => t.status !== 'DONE');
    bulkFabButton.current?.updateItems(doneTasks);
  }, [tasks]);

  const keyExtractor = useCallback((item: Task) => item['@id'], []);

  const renderItem = useCallback(
    ({ item: task, index }) => {
      const nextTask = index < tasks.length - 1 ? tasks[index + 1] : null;
      return (
        <TaskRow
          task={task}
          nextTask={nextTask}
          index={index}
          taskListId={id}
          appendTaskListTestID={appendTaskListTestID}
          onTaskClick={onTaskClick}
          onOrderClick={onOrderClick}
          onLongPress={onLongPress}
          onPressLeft={onPressLeft}
          onPressRight={onPressRight}
          onSwipedToLeft={_handleSwipeToLeft}
          onSwipedToRight={_handleSwipeToRight}
          onSwipeClosed={_handleSwipeClosed}
          onSort={onSort ? _handleSort : undefined}
          onSortBefore={onSortBefore ? _handleSortBefore : undefined}
          swipeOutLeftBackgroundColor={swipeOutLeftBackgroundColor}
          swipeOutLeftIcon={swipeOutLeftIcon}
          swipeOutRightBackgroundColor={swipeOutRightBackgroundColor}
          swipeOutRightIcon={swipeOutRightIcon}
        />
      );
    },
    [
      tasks,
      id,
      appendTaskListTestID,
      onTaskClick,
      onOrderClick,
      onLongPress,
      onPressLeft,
      onPressRight,
      _handleSwipeToLeft,
      _handleSwipeToRight,
      _handleSwipeClosed,
      onSort,
      _handleSort,
      onSortBefore,
      _handleSortBefore,
      swipeOutLeftBackgroundColor,
      swipeOutLeftIcon,
      swipeOutRightBackgroundColor,
      swipeOutRightIcon,
    ],
  );

  return (
    <>
      <FlatList
        testID={`${id}SwipeListView`}
        data={tasks}
        keyExtractor={keyExtractor}
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
