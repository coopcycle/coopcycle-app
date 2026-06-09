import React, { useCallback, useEffect, useMemo, useRef } from 'react';
export type TaskListItemMethods = {
  openLeft: () => void;
  openRight: () => void;
  close: () => void;
};
import { ArrowRightCircle, LucideIcon } from 'lucide-react-native';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';


import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Task, TaskListItemProps } from '../types/task';

import { redColor, yellowColor } from '../styles/common';
import { ItemTouchable } from './ItemTouchable';
import { OrderInfo } from './OrderInfo';
import TaskInfo from './TaskInfo';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';
import { useTheme } from '@react-navigation/native';
import { Uri } from '@/src/redux/api/types';

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

interface ISwipeButtonContainerProps {
  backgroundColor?: string;
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  width: number;
  onPress?: () => void;
  testID?: string;
}
const SwipeButtonContainer = ({
  backgroundColor,
  children,
  left,
  right,
  width,
  onPress,
  testID,
}: ISwipeButtonContainerProps) => {
  const alignItems = left ? 'flex-start' : 'flex-end';
  const borderRadiusLeft = left ? cardBorderRadius : 0;
  const borderRadiusRight = right ? cardBorderRadius : 0;

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => onPress?.());

  return (
    <GestureDetector gesture={tap}>
      <View
        testID={testID}
        style={{
          alignItems,
          backgroundColor,
          justifyContent: 'center',
          width,
          borderTopLeftRadius: borderRadiusLeft,
          borderBottomLeftRadius: borderRadiusLeft,
          borderTopRightRadius: borderRadiusRight,
          borderBottomRightRadius: borderRadiusRight,
        }}>
        {children}
      </View>
    </GestureDetector>
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

export default function TaskListItem({
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
  onRegisterRef,
}) {
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

  if (task.status === 'DONE' || task.status === 'FAILED') {
    itemProps.opacity = 0.4;
  }

  if (task.status === 'FAILED') {
    textStyle.push(styles.textDanger);
  }

  const marginHorizontal = 6;
  const { width } = Dimensions.get('window');
  const cardWidth = width - marginHorizontal * 2;
  const buttonWidth = cardWidth / 4;
  const visibleButtonWidth = buttonWidth + 25;

  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (task.status === 'DONE') {
      swipeableRef.current?.close();
    }
  }, [task.status]);

  const taskUri: Uri = task['@id'];

  // When FlashList recycles this cell for a different task, snap the swipeable
  // back to closed without triggering onSwipeableClose callbacks.
  useEffect(() => {
    isOpenRef.current = false;
    swipeableRef.current?.reset();
  }, [taskUri]);

  // Expose swipeable controls to the parent for linked-task coordination.
  const methods = useMemo<TaskListItemMethods>(() => ({
    openLeft:  () => swipeableRef.current?.openLeft(),
    openRight: () => swipeableRef.current?.openRight(),
    close:     () => swipeableRef.current?.close(),
  }), []);

  useEffect(() => {
    onRegisterRef?.(taskUri, methods);
    return () => onRegisterRef?.(taskUri, null);
  }, [taskUri, onRegisterRef, methods]);

  const onTaskPress = () => {
    if (context?.isEditMode && task.status === 'CANCELLED') return;

    if (context?.isEditMode) {
      context.toggleTaskSelection(task);
      return;
    }

    onPress();
  }

  const allowSwipeLeft = task.status !== 'DONE';
  const allowSwipeRight = task.status !== 'DONE';

  const renderLeftActions = useCallback(() => (
    <SwipeButtonContainer
      backgroundColor={swipeOutLeftBackgroundColor}
      left
      onPress={() => {
        swipeableRef.current?.close();
        onPressLeft();
      }}
      testID={`${taskTestId}:left`}
      width={visibleButtonWidth}>
      <SwipeButton icon={swipeOutLeftIcon} width={buttonWidth} />
    </SwipeButtonContainer>
  ), [swipeOutLeftBackgroundColor, swipeOutLeftIcon, onPressLeft, buttonWidth, visibleButtonWidth, taskTestId]);

  const renderRightActions = useCallback(() => (
    <SwipeButtonContainer
      backgroundColor={swipeOutRightBackgroundColor}
      right
      onPress={() => {
        swipeableRef.current?.close();
        onPressRight();
      }}
      testID={`${taskTestId}:right`}
      width={visibleButtonWidth}>
      <SwipeButton icon={swipeOutRightIcon} width={buttonWidth} />
    </SwipeButtonContainer>
  ), [swipeOutRightBackgroundColor, swipeOutRightIcon, onPressRight, buttonWidth, visibleButtonWidth, taskTestId]);

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
      <View style={{
        borderRadius: cardBorderRadius,
        marginVertical: 1.5,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        overflow: 'hidden',
      }}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        renderLeftActions={allowSwipeLeft ? renderLeftActions : undefined}
        renderRightActions={allowSwipeRight ? renderRightActions : undefined}
        onSwipeableOpen={(direction) => {
          isOpenRef.current = true;
          if (direction === 'right' && onSwipedToLeft) onSwipedToLeft();
          else if (direction === 'left' && onSwipedToRight) onSwipedToRight();
        }}
        onSwipeableClose={() => {
          if (!isOpenRef.current) return; // guard against re-entrant close cascade
          isOpenRef.current = false;
          if (onSwipeClosed) onSwipeClosed();
        }}>
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
              onPress={onTaskPress}
              onLongPress={() => onLongPress(task)}
              delayLongPress={1000}
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
      </Swipeable>
      </View>
      {renderSortButton()}
    </View>
  );
};
