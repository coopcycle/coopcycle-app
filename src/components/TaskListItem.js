import moment from 'moment';
import { Box, HStack, Icon, Text, VStack, useTheme } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
blackColor,
lightGreyColor,
redColor,
whiteColor,
yellowColor,
} from '../styles/common';
import {
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


const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  textBold: {
    marginLeft: -8,
    fontSize: 14,
    fontWeight: 700,
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

const iconStyle = task => {
  const style = [styles.icon];
  if (task.status === 'FAILED') {
    style.push(styles.iconDanger);
  }

  return style;
};


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
    <View
      style={{
        backgroundColor,
        width,
        height: '100%',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
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
    </View>
  )
}

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
      width={2}
      height='100%'
      backgroundColor={backgroundColor}
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

  return (
    <TouchableOpacity
      style={{
        alignItems,
        backgroundColor,
        justifyContent: 'center',
        width,
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

const ItemTouchable = ({ children, ...otherProps }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}
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
      task,
      taskListId,
    } = this.props;

    const taskTestId = `${taskListId}:task:${index}`;
    const itemStyle = [];
    const textStyle = [styles.text];
    const itemProps = {};

    if (task.status === 'DONE' || task.status === 'FAILED') {
      itemProps.opacity = 0.4;
    }

    if (task.status === 'FAILED') {
      textStyle.push(styles.textDanger);
    }

    const { width } = Dimensions.get('window');
    const buttonWidth = width / 4;
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
      >
        <View style={styles.rowBack}>
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
              iconName={swipeOutLeftIconName || doneIconName}
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
              iconName={swipeOutRightIconName || incidentIconName}
              width={buttonWidth}
            />
          </SwipeButtonContainer>
        </View>
        <ItemTouchable onPress={onPress} testID={taskTestId}>
          <HStack
            flex={1}
            alignItems="stretch"
            styles={itemStyle}
            minHeight={buttonWidth}
            {...itemProps}>
            <OrderInfo
              color={color}
              task={task}
              width={buttonWidth}
            />
            <VStack flex={1} py="3" px="1">
              <HStack alignItems='center'>
                <TaskTypeIcon task={task}/>
                {task.orgName ? (
                  <Text style={styles.textBold}>{task.orgName}</Text>
                ) : null}
                <TaskStatusIcon task={task}/>
              </HStack>
              {task.address?.contactName ? (
                <Text style={textStyle}>{task.address.contactName}</Text>
              ) : null}
              {task.address?.name ? (
                <Text style={textStyle}>{task.address.name}</Text>
              ) : null}
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
                </HStack>
              ) : null}
            </VStack>
            {task.hasIncidents && <Icon as={FontAwesome} name="exclamation-triangle" size="md" style={{ backgroundColor: yellowColor, color: redColor, marginRight: 12, borderRadius: 5 }} />}
            <TaskPriorityStatus task={task} />
          </HStack>
        </ItemTouchable>
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
