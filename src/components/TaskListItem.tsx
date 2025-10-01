import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { LucideIcon } from 'lucide-react-native';
import {
  Dimensions,
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
      color,
      index,
      taskListId,
      appendTaskListTestID = '',
      onPress = () => {},
      onLongPress = () => {},
      onOrderPress = () => {},
      onPressLeft = () => {},
      onPressRight = () => {},
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
    const isSelectedTask = useMemo(() => {
      if (!context?.selectedTasksToEdit?.length || !task['@id']) {
        return false;
      }
      return context?.selectedTasksToEdit.some(
        selectedTask => selectedTask['@id'] === task['@id']
      );
    }, [context?.selectedTasksToEdit, task]);
    const taskTestId = `${taskListId}${appendTaskListTestID}:task:${index}`;
    const textStyle = [styles.text];

    const itemProps: { opacity?: number } = {};
    const swipeButtonsProps: { display?: string } = {};

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

    // swipeLeft
    const allTasksIdsFromOrders = useSelector(selectAllTasksIdsFromOrders);
    const shouldSwipeLeft = allTasksIdsFromOrders.includes(task['@id']);
    const allTasksIdsFromTasks = useSelector(selectAllTasksIdsFromTasks);
    const shouldSwipeRight = allTasksIdsFromTasks.includes(task['@id']);

    const prevShouldSwipeLeftRef = useRef<boolean>();
    const prevShouldSwipeRightRef = useRef<boolean>();

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

    return (
      // @ts-expect-error library's types don't include a children prop
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
        <HStack
          style={{
            flex: 1,
            minWidth: '100%',
            minHeight: buttonWidth,
            ...(isSelectedTask && {
              borderBottomWidth: cardBorderWidth,
              borderTopWidth: cardBorderWidth,
              borderEndWidth: cardBorderWidth,
              borderColor: task.color,
              borderRadius: cardBorderRadius,
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
      </SwipeRow>
    );
  },
);

export default TaskListItem;
