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
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
import CoopcyleLogo from '../../assets/images/logo.svg';


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

function getOrderId(task) {
  const id = task.metadata?.delivery_position
    ? `${task.metadata.order_number}-${task.metadata.delivery_position}`
    : task.metadata.order_number;

  return id;
}

const OrderInfo = ({task, color, width}) => {
  const isDefaultColor = color === '#ffffff';
  const backgroundColor = isDefaultColor ? lightGreyColor : color;
  const textColor = isDefaultColor ? blackColor : whiteColor;
  const orderId = getOrderId(task);

  return (
    <ItemTouchable
      onPress={() => console.log("order info pressed")}
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
      { orderId
      ? (
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
          {task.metadata.order_total && (
            <Text
              style={{
                color: textColor,
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 15,
              }}>
              {formatPrice(task.metadata.order_total)}
            </Text>
          )}
        </>)
        : (
          <CoopcyleLogo
            width={width * 0.5}
            height={width * 0.5}
          />
        )}
    </ItemTouchable>
  )
}

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

  switch (task.status) {
    case 'DOING':
      return (
        <Icon
          as={FontAwesome}
          color={color}
          name={doingIconName}
          style={iconStyle(task)}
          testID='taskListItemIcon-DOING'
        />
      );
    case 'DONE':
      return (
        <Icon
          as={FontAwesome}
          color={color}
          name={doneIconName}
          style={iconStyle(task)}
          testID='taskListItemIcon-DONE'
        />
      );
    case 'FAILED':
      return (
        <Icon
          as={FontAwesome}
          color={color}
          name={failedIconName}
          style={iconStyle(task)}
          testID='taskListItemIcon-FAILED'
        />
      );
    default:
      return <View />;
  }
};

const TaskPriorityStatus = ({task}) => {
  let backgroundColor = whiteColor;
  const now = moment();
  const timeDifference = now.diff(task.doneBefore);

  if (timeDifference < minutes(10)) {
    backgroundColor = '#FFC300';
  }

  if (timeDifference < minutes(0)) {
    backgroundColor = '#B42205';
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
  )
}

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
    <Icon as={FontAwesome} name={iconName} style={{ color: '#ffffff' }} />
  </View>
);

const ItemTouchable = ({ children, style, ...otherProps }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white', ...style }}
      underlayColor={
        colorScheme === 'dark' ? colors.gray['700'] : colors.gray['200']
      }
      {...otherProps}>
      {children}
    </TouchableHighlight>
  );
};

class TaskListItem extends Component {
  constructor(props) {
    super(props);
    this.swipeRow = React.createRef();

    this._onRowOpen = this._onRowOpen.bind(this);
    this._onRowClose = this._onRowClose.bind(this);
  }

  _onRowOpen(toValue) {
    if (toValue > 0 && this.props.onSwipedToLeft) {
      this.props.onSwipedToLeft();
    } else if (toValue < 0 && this.props.onSwipedToRight) {
      this.props.onSwipedToRight();
    }
  }

  _onRowClose() {
    if (this.props.onSwipeClosed) {
      this.props.onSwipeClosed();
    }
  }

  componentDidUpdate() {
    const { task } = this.props;

    if (task.status === 'DONE') {
      this.swipeRow.current?.closeRow();
    }
  }

  render() {
    const {
      color,
      disableLeftSwipe,
      disableRightSwipe,
      index,
      onPress,
      onPressLeft,
      onPressRight,
      swipeOutLeftBackgroundColor,
      swipeOutLeftIconName,
      swipeOutRightBackgroundColor,
      swipeOutRightIconName,
      t,
      task,
      taskListId,
    } = this.props;

    const taskTitle = task.orgName
      ? ( task.metadata.order_number
        ? task.orgName
        : `${task.orgName} - ${t('TASK_WITH_ID', { id: task.id })}`
      )
      : t('TASK_WITH_ID', { id: task.id });

    const address = task.address?.contactName
      ? (
        task.address?.name
          ? `${task.address.contactName} - ${task.address.name}`
          : task.address.contactName
      )
      : (
        task.address?.name
        ? task.address.name
        : null
      );

    const taskTestId = `${taskListId}:task:${index}`;
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

    return (
      <SwipeRow
        disableRightSwipe={disableRightSwipe}
        disableLeftSwipe={disableLeftSwipe}
        leftOpenValue={buttonWidth}
        stopLeftSwipe={visibleButtonWidth}
        rightOpenValue={-buttonWidth}
        stopRightSwipe={-visibleButtonWidth}
        onRowOpen={toValue => this._onRowOpen(toValue)}
        onRowClose={this._onRowClose}
        ref={this.swipeRow}
        style={{
          borderRadius: cardBorderRadius,
          marginVertical: 1.5,
          marginLeft: marginHorizontal,
          marginRight:marginHorizontal,
        }}
      >
        <View style={{...styles.rowBack, ...swipeButtonsProps}}>
          <SwipeButtonContainer
            backgroundColor={swipeOutLeftBackgroundColor}
            left
            onPress={() => {
              this.swipeRow.current.closeRow();
              onPressLeft();
            }}
            testID={`${taskTestId}:left`}
            width={visibleButtonWidth}>
            <SwipeButton
              iconName={swipeOutLeftIconName}
              width={buttonWidth}
            />
          </SwipeButtonContainer>
          <SwipeButtonContainer
            backgroundColor={swipeOutRightBackgroundColor}
            right
            onPress={() => {
              this.swipeRow.current.closeRow();
              onPressRight();
            }}
            testID={`${taskTestId}:right`}
            width={visibleButtonWidth}>
            <SwipeButton
              iconName={swipeOutRightIconName}
              width={buttonWidth}
            />
          </SwipeButtonContainer>
        </View>
        <HStack
          style={{
            flex: 1,
            alignItems: "stretch",
            minHeight: buttonWidth,
            borderTopRightRadius: cardBorderRadius,
            borderBottomRightRadius: cardBorderRadius,
          }}
          {...itemProps}>
          <OrderInfo
            color={color}
            task={task}
            width={buttonWidth}
          />
          <ItemTouchable
            onPress={onPress}
            testID={taskTestId}
            style={{
              borderBottomRightRadius: cardBorderRadius,
              borderTopRightRadius: cardBorderRadius,
              paddingLeft: 12,
              width: cardWidth-buttonWidth,
            }}
          >
            <HStack
              style={{
                height: '100%'
              }}
            >
              <VStack flex={1} py="3" px="1">
                <HStack alignItems='center'>
                  <TaskTypeIcon task={task}/>
                  <Text
                    style={styles.textBold}
                    numberOfLines={1}>
                    {taskTitle}
                  </Text>
                  <TaskStatusIcon task={task}/>
                </HStack>
                {address && (
                  <Text style={textStyle} numberOfLines={1}>{address}</Text>
                )}
                <Text numberOfLines={1} style={textStyle}>
                  {task.address?.streetAddress}
                </Text>
                <HStack alignItems="center">
                  <Text pr="2" style={textStyle}>
                    {moment(task.doneAfter).format('LT')} -{' '}
                    {moment(task.doneBefore).format('LT')}
                  </Text>
                  {task.address?.description && task.address?.description.length ? (
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
                          textStyle,
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
                      }}/>
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
                  }} />
              )}
              <TaskPriorityStatus task={task} />
            </HStack>
          </ItemTouchable>
        </HStack>
      </SwipeRow>
    );
  }
}

TaskListItem.defaultProps = {
  onPress: () => {},
  onPressLeft: () => {},
  onPressRight: () => {},
};

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  taskListId: PropTypes.string.isRequired
};

// We need to use "withRef" prop,
// for react-native-swipe-list-view CellRenderer to not trigger a warning
export default withTranslation(['common'], { withRef: true })(TaskListItem);
