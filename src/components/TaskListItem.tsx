import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Recycle } from 'lucide-react-native';
import moment from 'moment';
import React, { forwardRef, useEffect, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';
import { Task, TaskListItemProps } from '../types/task';

import { CommentsIcon, IncidentIcon } from '../navigation/task/styles/common';
import {
  selectAllTasksIdsFromOrders,
  selectAllTasksIdsFromTasks,
} from '../redux/Dispatch/selectors';
import { getTaskTitle } from '../shared/src/utils';
import { blackColor, greyColor, redColor, yellowColor } from '../styles/common';
import { ItemTouchable } from './ItemTouchable';
import { OrderInfo } from './OrderInfo';
import { PaymentMethodInList } from './PaymentMethodInfo';
import { TaskPriorityStatus } from './TaskPriorityStatus';
import { TaskStatusIcon } from './TaskStatusIcon';
import TaskTagsList from './TaskTagsList';
import { getTaskTitleForOrder } from '../navigation/order/utils';
import { useTranslation } from 'react-i18next';

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
  icon: React.ElementType;
  width: number;
  size?: number;
}

const SwipeButton = ({ icon, width, size }: ISwipeButtonProps) => (
  <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={icon} size={size} style={{ color: '#ffffff', width: 40 }} />
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
    const { t } = useTranslation();
    const taskDropoffTitle = getTaskTitleForOrder(task, t);
    const taskTitle = getTaskTitle(task);

    const isPickup = task.type === 'PICKUP';

    const address = task.address?.contactName
      ? task.address?.name
        ? `${task.address.contactName} - ${task.address.name}`
        : task.address.contactName
      : task.address?.name
        ? task.address.name
        : null;

    const taskTestId = `${taskListId}${appendTaskListTestID}:task:${index}`;
    const textStyle = [styles.text];
    const alignedTextStyle = isPickup
      ? [styles.text, { textAlign: 'right' as const }]
      : [styles.text];
    const itemProps: { opacity?: number } = {};
    const swipeButtonsProps: { display?: string } = {};

    if (task.status === 'DONE' || task.status === 'FAILED') {
      itemProps.opacity = 0.4;
      swipeButtonsProps.display = 'none';
    }

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
            <SwipeButton
              icon={swipeOutRightIcon}
              size={8}
              width={buttonWidth}
            />
          </SwipeButtonContainer>
        </View>
        <HStack
          style={{
            flex: 1,
            backgroundColor: 'green',
            minWidth: '100%',
            minHeight: buttonWidth,
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
            testID={taskTestId}
            style={{
              borderBottomRightRadius: cardBorderRadius,
              borderTopRightRadius: cardBorderRadius,
              paddingLeft: 12,
              width: cardWidth - buttonWidth,
            }}>
            <HStack>
              <VStack
                className="py-3 px-1"
                style={isPickup ? { alignItems: 'flex-end' } : undefined}>
                <Text
                  testID={`${taskTestId}:title`}
                  style={[styles.titleText, !isPickup && { color: greyColor }]}
                  numberOfLines={1}>
                  {taskTitle}
                </Text>

                {isPickup ? (
                  <Text>Calcultate arrows</Text>
                ) : (
                  <Text>{taskDropoffTitle}</Text>
                )}

                {address && (
                  <Text style={alignedTextStyle} numberOfLines={1}>
                    {address}
                  </Text>
                )}
                <Text numberOfLines={1} style={alignedTextStyle}>
                  {task.address?.streetAddress}
                </Text>
                <HStack
                  className="items-center"
                  style={isPickup ? { justifyContent: 'flex-end' } : undefined}>
                  <Text className="pr-2" style={alignedTextStyle}>
                    {`${moment(task.doneAfter).format('LT')} - ${moment(task.doneBefore).format('LT')}`}
                  </Text>
                  <TaskStatusIcon task={task} />
                  {task.address?.description &&
                  task.address?.description.length ? (
                    <Icon className="mr-2" as={CommentsIcon} size="xs" />
                  ) : null}
                  {task.metadata && task.metadata?.payment_method && (
                    <PaymentMethodInList
                      paymentMethod={task.metadata.payment_method}
                    />
                  )}
                  {task.metadata && task.metadata.zero_waste && (
                    <Icon as={Recycle} size="sm" />
                  )}
                </HStack>
                {task.tags && task.tags.length ? (
                  isPickup ? (
                    <View style={{ alignSelf: 'flex-end', width: '100%' }}>
                      <TaskTagsList taskTags={task.tags} />
                    </View>
                  ) : (
                    <TaskTagsList taskTags={task.tags} />
                  )
                ) : null}
              </VStack>
              {task.hasIncidents && (
                <Icon
                  as={IncidentIcon}
                  size={24}
                  style={{
                    alignSelf: 'center',
                    borderRadius: 5,
                    color: redColor,
                    marginRight: 12,
                  }}
                />
              )}
              <TaskPriorityStatus
                task={task}
                cardBorderRadius={cardBorderRadius}
              />
            </HStack>
          </ItemTouchable>
        </HStack>
      </SwipeRow>
    );
  },
);

/* // PropTypes kept for backward compatibility with non-TypeScript code
TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  taskListId: PropTypes.string.isRequired,
}; */

export default TaskListItem;
