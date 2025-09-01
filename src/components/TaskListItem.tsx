import { Box, HStack, Icon, Text, VStack } from 'native-base';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef } from 'react';

import {
  redColor,
  whiteColor,
  yellowColor,
} from '../styles/common';
import {
  commentsIconName,
  incidentIconName,
} from '../navigation/task/styles/common';
import { minutes } from '../utils/dates';
import { PaymentMethodInList } from './PaymentMethodInfo';
import {
  selectAllTasksIdsFromOrders,
  selectAllTasksIdsFromTasks,
} from '../redux/Dispatch/selectors';
import { getTaskTitle } from '../shared/src/utils';
import { ItemTouchable } from './ItemTouchable';
import { OrderInfo } from './OrderInfo';
import { TaskStatusIcon, TaskTypeIcon } from './TaskStatusIcon';

const cardBorderRadius = 2.5;

export const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  textBold: {
    fontSize: 14,
    fontWeight: 700,
    marginLeft: -8,
    overflow: 'hidden',
  },
  textDanger: {
    color: redColor,
  },
  hasIncident: {
    borderColor: yellowColor,
  },
  icon: {
    fontSize: 18,
  },
  iconDanger: {
    color: redColor,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagsWrapper: {
    flexWrap: 'wrap',
    gap: 2,
  },
  tag: {
    paddingVertical: 0,
    paddingHorizontal: 4,
    color: '#ffffff',
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'capitalize',
    marginTop: 4,
  },
});

const TaskPriorityStatus = ({ task }) => {
  const timeDifference = moment().diff(task.doneBefore);
  let backgroundColor = whiteColor;

  if (timeDifference < minutes(10)) {
    backgroundColor = '#FFC300';
  } else if (timeDifference < minutes(0)) {
    backgroundColor = '#B42205';
  } else {
    return null;
  }

  return (
    <Box
      style={{
        width: 6,
        height: '100%',
        backgroundColor: backgroundColor,
        borderTopRightRadius: cardBorderRadius,
        borderBottomRightRadius: cardBorderRadius,
      }}
    />
  );
};

const SwipeButtonContainer = ({
  backgroundColor,
  children,
  left,
  right,
  width,
  ...otherProps
}) => {
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

const SwipeButton = ({ iconName, width }) => (
  <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon
      as={FontAwesome}
      name={iconName}
      style={{ color: '#ffffff', width: 40 }}
    />
  </View>
);

const TaskListItem = forwardRef(
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
      swipeOutLeftIconName,
      swipeOutRightBackgroundColor,
      swipeOutRightIconName,
      onSwipedToLeft,
      onSwipedToRight,
      onSwipeClosed,
    },
    _ref,
  ) => {
    const taskTitle = getTaskTitle(task);

    const address = task.address?.contactName
      ? task.address?.name
        ? `${task.address.contactName} - ${task.address.name}`
        : task.address.contactName
      : task.address?.name
        ? task.address.name
        : null;

    const taskTestId = `${taskListId}${appendTaskListTestID}:task:${index}`;
    const textStyle = [styles.text];
    const itemProps = {};
    const swipeButtonsProps = {};

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

    const swipeRow = useRef(null);

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

    const prevShouldSwipeLeftRef = useRef();
    const prevShouldSwipeRightRef = useRef();

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

    function _onRowOpen(toValue) {
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
              swipeRow.current.closeRow();
              onPressLeft();
            }}
            testID={`${taskTestId}:left`}
            width={visibleButtonWidth}>
            <SwipeButton iconName={swipeOutLeftIconName} width={buttonWidth} />
          </SwipeButtonContainer>
          <SwipeButtonContainer
            backgroundColor={swipeOutRightBackgroundColor}
            right
            onPress={() => {
              swipeRow.current.closeRow();
              onPressRight();
            }}
            testID={`${taskTestId}:right`}
            width={visibleButtonWidth}>
            <SwipeButton
              iconName={swipeOutRightIconName}
              size={8}
              width={buttonWidth}
            />
          </SwipeButtonContainer>
        </View>
        <HStack
          style={{
            flex: 1,
            alignItems: 'stretch',
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
            <HStack
              style={{
                height: '100%',
              }}>
              <VStack flex={1} py="3" px="1">
                <HStack alignItems="center">
                  <TaskTypeIcon task={task} />
                  <Text
                    testID={`${taskTestId}:title`}
                    style={styles.textBold}
                    numberOfLines={1}>
                    {taskTitle}
                  </Text>
                  <TaskStatusIcon task={task} />
                </HStack>
                {address && (
                  <Text style={textStyle} numberOfLines={1}>
                    {address}
                  </Text>
                )}
                <Text numberOfLines={1} style={textStyle}>
                  {task.address?.streetAddress}
                </Text>
                <HStack alignItems="center">
                  <Text pr="2" style={textStyle}>
                    {moment(task.doneAfter).format('LT')} -{' '}
                    {moment(task.doneBefore).format('LT')}
                  </Text>
                  {task.address?.description &&
                  task.address?.description.length ? (
                    <Icon mr="2" as={FontAwesome} name="comments" size="xs" />
                  ) : null}
                  {task.metadata && task.metadata?.payment_method && (
                    <PaymentMethodInList
                      paymentMethod={task.metadata.payment_method}
                    />
                  )}
                  {task.metadata && task.metadata.zero_waste && (
                    <Icon as={FontAwesome5} name="recycle" size="sm" />
                  )}
                </HStack>
                {task.tags && task.tags.length ? (
                  <HStack style={styles.tagsWrapper}>
                    {task.tags.map(tag => (
                      <Text
                        key={tag.slug}
                        style={[
                          styles.textStyle,
                          styles.tag,
                          {
                            backgroundColor: tag.color,
                          },
                        ]}>
                        {tag.name}
                      </Text>
                    ))}
                    <Icon
                      as={FontAwesome}
                      name={commentsIconName}
                      style={{
                        paddingHorizontal: 4,
                        fontSize: 14,
                      }}
                    />
                  </HStack>
                ) : null}
              </VStack>
              {task.hasIncidents && (
                <Icon
                  as={FontAwesome}
                  name={incidentIconName}
                  style={{
                    alignSelf: 'center',
                    borderRadius: 5,
                    color: redColor,
                    marginRight: 12,
                  }}
                />
              )}
              <TaskPriorityStatus task={task} />
            </HStack>
          </ItemTouchable>
        </HStack>
      </SwipeRow>
    );
  },
);

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  taskListId: PropTypes.string.isRequired,
};

export default TaskListItem;
