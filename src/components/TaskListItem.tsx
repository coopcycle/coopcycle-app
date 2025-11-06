import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { ArrowRightCircle, LucideIcon } from 'lucide-react-native';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Task, TaskListItemProps } from '../types/task';
import {
  selectAllTasksIdsFromOrders,
  selectAllTasksIdsFromTasks,
} from '../redux/Dispatch/selectors';
import { redColor, yellowColor } from '../styles/common';
import { ItemTouchable } from './ItemTouchable';
import { OrderInfo } from './OrderInfo';
import TaskInfo from './TaskInfo';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';
import { useTheme } from '@react-navigation/native';

const cardBorderWidth = 4;
const cardBorderRadius = 2.5;

export const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  textBold: {
    fontSize: 14,
    fontWeight: 700,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  textDanger: {
    fontSize: 14,
    color: redColor,
  },
  hasIncident: {
    borderColor: yellowColor,
  },
  icon: {
    marginRight: 12,
  },
  iconDanger: {
    color: redColor,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    marginLeft: 12,
    marginVertical: 4,
  },
  cancelledTask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  cancelledLine: {
    position: 'absolute',
    top: -100,
    bottom: -100,
    width: 25,
    backgroundColor: 'rgba(150,150,150,0.2)',
    transform: [{ rotate: '-35deg' }],
  },
});

interface ISwipeButtonContainerProps
  extends Omit<TouchableOpacityProps, 'style'> {
  backgroundColor?: string;
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  width: number;
}
const SwipeButtonContainer = ({
  backgroundColor,
  children,
  left,
  right,
  width,
  ...otherProps
}: ISwipeButtonContainerProps) => {
  const alignItems = left ? 'flex-start' : 'flex-end';
  const borderRadiusLeft = left ? cardBorderRadius : 0;
  const borderRadiusRight = right ? cardBorderRadius : 0;

  return (
    <TouchableOpacity
      style={{
        alignItems,
        backgroundColor,
        justifyContent: 'center',
        width,
        borderTopLeftRadius: borderRadiusLeft,
        borderBottomLeftRadius: borderRadiusLeft,
        borderTopRightRadius: borderRadiusRight,
        borderBottomRightRadius: borderRadiusRight,
      }}
      {...otherProps}>
      {children}
    </TouchableOpacity>
  );
};

interface ISwipeButtonProps {
  icon: LucideIcon | undefined;
  width: number;
  size?: number;
}

const CancelledBackground = ({taskTestId}) => {
  const { width } = Dimensions.get('window');
  const stripeWidth = 25;
  const numLines = Math.ceil(width / stripeWidth) + 2;

  return (
    <View style={styles.cancelledTask} pointerEvents='none' testID={`${taskTestId}:cancelledBg`}>
      {Array.from({ length: numLines }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.cancelledLine,
            {
              left: i * stripeWidth,
            },
          ]}
        />
      ))}
    </View>
  );
};

const SwipeButton = ({ icon, width, size = 42 }: ISwipeButtonProps) => (
  <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={icon} size={size} style={{ color: '#ffffff' }} />
  </View>
);

const TaskListItem = forwardRef<SwipeRow<Task>, TaskListItemProps>(
  (
    {
      task,
      nextTask,
      color,
      index,
      taskListId,
      appendTaskListTestID = '',
      onPress = () => {},
      onLongPress = () => {},
      onOrderPress = () => {},
      onPressLeft = () => {},
      onPressRight = () => {},
      onSortBefore = undefined,
      onSort = undefined,
      swipeOutLeftBackgroundColor,
      swipeOutLeftIcon,
      swipeOutRightBackgroundColor,
      swipeOutRightIcon,
      onSwipedToLeft,
      onSwipedToRight,
      onSwipeClosed,
    },
    _ref,
  ) => {
    const isPickup = task.type === 'PICKUP';
    const context = useTaskListsContext();
    const theme = useTheme();

    const isAssignedToSameCourier = useMemo(() => {
      return task.isAssigned && task.assignedTo === context?.selectedTasksToEdit[0]?.assignedTo;
    }, [context?.selectedTasksToEdit, task]);

    const isSelectedTask = useMemo(() => {
      if (!context?.selectedTasksToEdit?.length || !task['@id']) {
        return false;
      }
      return context?.selectedTasksToEdit.some(
        selectedTask => selectedTask['@id'] === task['@id']
      );
    }, [context?.selectedTasksToEdit, task]);

    const isSortable = useMemo(() => {
      return context?.selectedTasksToEdit?.length === 1 && !isSelectedTask;
    }, [context?.selectedTasksToEdit, isSelectedTask]);

    const isPreviousToSelectedTask = useMemo(() => {
      return nextTask?.['@id'] === context?.selectedTasksToEdit[0]?.['@id'];
    }, [nextTask, context]);

    const taskTestId = `${taskListId}${appendTaskListTestID}:task:${index}`;
    const textStyle = [styles.text];

    const itemProps = {opacity: 1};
    const swipeButtonsProps = {display: 'flex'};

    if (task.status === 'DONE' || task.status === 'FAILED') {
      itemProps.opacity = 0.4;
      swipeButtonsProps.display = 'none';
    }

    // TODO check - are we using this?
    if (task.status === 'FAILED') {
      textStyle.push(styles.textDanger);
    }

    const marginHorizontal = 6;
    const { width } = Dimensions.get('window');
    const cardWidth = width - marginHorizontal * 2;
    const buttonWidth = cardWidth / 4;
    const visibleButtonWidth = buttonWidth + 25;

    const swipeRow = useRef<SwipeRow<Task>>(null);

    useEffect(() => {
      if (task.status === 'DONE') {
        swipeRow.current?.closeRow();
      }
    }, [task.status]);

    const allTasksIdsFromOrders = useSelector(selectAllTasksIdsFromOrders);
    const shouldSwipeLeft = allTasksIdsFromOrders.includes(task['@id']);
    const allTasksIdsFromTasks = useSelector(selectAllTasksIdsFromTasks);
    const shouldSwipeRight = allTasksIdsFromTasks.includes(task['@id']);

    const prevShouldSwipeLeftRef = useRef(false);
    const prevShouldSwipeRightRef = useRef(false);

    useEffect(() => {
      if (shouldSwipeLeft && !prevShouldSwipeLeftRef.current) {
        swipeRow.current?.manuallySwipeRow?.(buttonWidth);
      } else if (!shouldSwipeLeft && prevShouldSwipeLeftRef.current) {
        swipeRow.current?.closeRow?.();
      }
      prevShouldSwipeLeftRef.current = shouldSwipeLeft;
    }, [shouldSwipeLeft, buttonWidth]);

    useEffect(() => {
      if (shouldSwipeRight && !prevShouldSwipeRightRef.current) {
        swipeRow.current?.manuallySwipeRow?.(-buttonWidth);
      } else if (!shouldSwipeRight && prevShouldSwipeRightRef.current) {
        swipeRow.current?.closeRow?.();
      }
      prevShouldSwipeRightRef.current = shouldSwipeRight;
    }, [shouldSwipeRight, buttonWidth]);

    function _onRowOpen(toValue: number) {
      if (toValue > 0 && onSwipedToLeft) {
        onSwipedToLeft();
      } else if (toValue < 0 && onSwipedToRight) {
        onSwipedToRight();
      }
    }

    function _onRowClose() {
      if (onSwipeClosed) {
        onSwipeClosed();
      }
    }

    const allowSwipeLeft =
      task.status !== 'DONE' && !allTasksIdsFromOrders.includes(task['@id']);
    const allowSwipeRight =
      task.status !== 'DONE' && !allTasksIdsFromTasks.includes(task['@id']);

    const renderPrevSortButton = () => {
      if (index === 0) {
        return sortButton(onSortBefore, true);
      }
    };

    const renderSortButton = () => {
      if (!isPreviousToSelectedTask) {
        return sortButton(onSort);
      }
    }

    const sortButton = (onSortCallback: TaskListItemProps['onSort'] | TaskListItemProps['onSortBefore'], isFirstPosition: boolean = false) => {
      if (!onSortCallback || !isAssignedToSameCourier || !isSortable) return null;
      const appendSortID = isFirstPosition ? `sort:previous` : `sort`;
      return (
        // @ts-expect-error It doeson't like onPress={onSortCallback} (but it works)
        <Pressable onPress={onSortCallback} style={styles.sortButton} testID={`${taskTestId}:${appendSortID}`}>
          <ArrowRightCircle color={theme.dark ? '#ffffff' : '#444444'}/>
        </Pressable>
      );
    }

    return (
    <View>
      {renderPrevSortButton()}
      {/* @ts-expect-error library's types don't include a children prop */}
      <SwipeRow
        disableLeftSwipe={!allowSwipeLeft}
        disableRightSwipe={!allowSwipeRight}
        leftOpenValue={buttonWidth}
        stopLeftSwipe={visibleButtonWidth}
        rightOpenValue={-buttonWidth}
        stopRightSwipe={-visibleButtonWidth}
        onRowOpen={toValue => _onRowOpen(toValue)}
        onRowClose={_onRowClose}
        ref={swipeRow}
        style={{
          borderRadius: cardBorderRadius,
          marginVertical: 1.5,
          marginLeft: marginHorizontal,
          marginRight: marginHorizontal,
        }}>
        <View style={{ ...styles.rowBack, ...swipeButtonsProps }}>
          <SwipeButtonContainer
            backgroundColor={swipeOutLeftBackgroundColor}
            left
            onPress={() => {
              swipeRow.current?.closeRow();
              onPressLeft();
            }}
            testID={`${taskTestId}:left`}
            width={visibleButtonWidth}>
            <SwipeButton icon={swipeOutLeftIcon} width={buttonWidth} />
          </SwipeButtonContainer>
          <SwipeButtonContainer
            backgroundColor={swipeOutRightBackgroundColor}
            right
            onPress={() => {
              swipeRow.current?.closeRow();
              onPressRight();
            }}
            testID={`${taskTestId}:right`}
            width={visibleButtonWidth}>
            <SwipeButton icon={swipeOutRightIcon} width={buttonWidth} />
          </SwipeButtonContainer>
        </View>
        <View style={{ position: 'relative', flex: 1, overflow: 'visible' }}>
          {task.status === 'CANCELLED' && <CancelledBackground taskTestId={taskTestId} />}
          <HStack
            style={{
              flex: 1,
              minWidth: '100%',
              minHeight: buttonWidth,
              ...(isSelectedTask && {
              paddingEnd: cardBorderWidth,
            }),
              borderTopRightRadius: cardBorderRadius,
              borderBottomRightRadius: cardBorderRadius,
            }}
            {...itemProps}>
            <OrderInfo
              color={color}
              task={task}
              width={buttonWidth}
              onPress={onOrderPress}
            />
            <ItemTouchable
              onPress={onPress}
              onLongPress={() => onLongPress(task)}
              testID={taskTestId}
              style={{
                borderBottomRightRadius: cardBorderRadius,
                borderTopRightRadius: cardBorderRadius,
                paddingLeft: 6,
                width: cardWidth - buttonWidth,
                flex: 1,
              }}>
              <TaskInfo task={task} isPickup={isPickup} taskTestId={taskTestId} />
            </ItemTouchable>
          </HStack>
          {isSelectedTask && (
            <View
              pointerEvents='none'
              style={{
                position:'absolute',
                top:0,
                left:0,
                bottom:0,
                right:0,
                borderColor:task.color,
                borderWidth: cardBorderWidth,
                borderRadius: cardBorderRadius,
              }}
            />
          )}
        </View>
      </SwipeRow>
      {renderSortButton()}
    </View>
    );
  },
);

export default TaskListItem;
