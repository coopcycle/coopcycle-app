import { Box, HStack, Icon, Text, VStack, useTheme } from 'native-base';
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef } from 'react';

import {
  blackColor,
  lightGreyColor,
  redColor,
  whiteColor,
  yellowColor,
} from '../styles/common';
import {
  commentsIconName,
  doingIconName,
  doneIconName,
  failedIconName,
  incidentIconName,
  taskTypeIconName,
} from '../navigation/task/styles/common';
import { formatPrice } from '../utils/formatting';
import { minutes } from '../utils/dates';
import { PaymentMethodInList } from './PaymentMethodInfo';
import {
  selectAllTasksIdsFromOrders,
  selectAllTasksIdsFromTasks,
} from '../redux/Dispatch/selectors';
import CoopcyleLogo from '../../assets/images/logo.svg';
import { getTaskTitle } from '../shared/src/utils';
import { getOrderIdWithPosition } from '../utils/tasks';

const cardBorderRadius = 2.5;

const styles = StyleSheet.create({
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

const OrderInfo = ({ task, color, width, onPress }) => {
  const isDefaultColor = color === '#ffffff';
  const backgroundColor = isDefaultColor ? lightGreyColor : color;
  const textColor = isDefaultColor ? blackColor : whiteColor;
  const orderId = getOrderIdWithPosition(task);

  return (
    <ItemTouchable
      onPress={() => onPress()}
      style={{
        alignItems: 'center',
        backgroundColor,
        borderBottomLeftRadius: cardBorderRadius,
        borderTopLeftRadius: cardBorderRadius,
        gap: 12,
        height: '100%',
        justifyContent: 'center',
        width,
      }}>
      {orderId ? (
        <>
          <Text
            style={{
              color: textColor,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 24,
            }}>
            {orderId}
          </Text>
          {task.metadata?.order_total ? (
            <Text
              style={{
                color: textColor,
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 15,
              }}>
              {formatPrice(task.metadata.order_total)}
            </Text>
          ) : null}
        </>
      ) : (
        <CoopcyleLogo width={width * 0.5} height={width * 0.5} />
      )}
    </ItemTouchable>
  );
};

const iconStyle = task => {
  const style = [styles.icon];
  if (task.status === 'FAILED') {
    style.push(styles.iconDanger);
  }

  return style;
};

const TaskTypeIcon = ({ task }) => (
  <Icon
    as={FontAwesome}
    style={iconStyle(task)}
    name={taskTypeIconName(task)}
  />
);

const TaskStatusIcon = ({ task }) => {
  const color = '#FFFFFF'; // Make it invisible
  const testID = `taskListItemIcon:${task.status}:${task.id}`;

  switch (task.status) {
    case 'DOING':
      return (
        <Icon
          as={FontAwesome}
          color={color}
          name={doingIconName}
          style={iconStyle(task)}
          testID={testID}
        />
      );
    case 'DONE':
      return (
        <Icon
          as={FontAwesome}
          color={color}
          name={doneIconName}
          style={iconStyle(task)}
          testID={testID}
        />
      );
    case 'FAILED':
      return (
        <Icon
          as={FontAwesome}
          color={color}
          name={failedIconName}
          style={iconStyle(task)}
          testID={testID}
        />
      );
    default:
      return <View />;
  }
};

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

const ItemTouchable = ({ children, style, ...otherProps }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      style={{
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        ...style,
      }}
      underlayColor={
        colorScheme === 'dark' ? colors.gray['700'] : colors.gray['200']
      }
      {...otherProps}>
      {children}
    </TouchableHighlight>
  );
};

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
