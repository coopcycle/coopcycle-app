import React, { Component } from 'react'
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View, useColorScheme } from 'react-native'
import { HStack, Icon, Text, VStack, useTheme } from 'native-base'
import { SwipeRow } from 'react-native-swipe-list-view'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { greenColor, redColor } from '../styles/common'
import {
  doingIconName,
  doneIconName,
  failedIconName,
  taskTypeIconName,
} from '../navigation/task/styles/common'
import TaskTitle from './TaskTitle'
import { PaymentMethodInfo } from './PaymentMethodInfo'

const styles = StyleSheet.create({
  itemIcon: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  text: {
    fontSize: 14,
  },
  textDanger: {
    color: redColor,
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
})

const iconStyle = task => {
  const style = [styles.icon]
  if (task.status === 'FAILED') {
    style.push(styles.iconDanger)
  }

  return style
}

const TaskTypeIcon = ({ task }) => (
  <Icon as={FontAwesome} style={ iconStyle(task) } name={ taskTypeIconName(task) } />
)

const TaskStatusIcon = ({ task }) => {

  switch (task.status) {
    case 'DOING':
      return (
        <Icon as={FontAwesome} name={ doingIconName } style={ iconStyle(task) } />
      )
    case 'DONE':
      return (
        <Icon as={FontAwesome} name={ doneIconName } style={ iconStyle(task) } />
      )
    case 'FAILED':
      return (
        <Icon as={FontAwesome} name={ failedIconName } style={ iconStyle(task) } />
      )
    default:
      return (
        <View />
      )
  }
}

const SwipeButtonContainer = props => {

  const { onPress, left, right, children, ...otherProps } = props
  const backgroundColor = left ? greenColor : redColor
  const alignItems = left ? 'flex-start' : 'flex-end'

  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', backgroundColor, alignItems }}
      onPress={ onPress }
      { ...otherProps }>
      { children }
    </TouchableOpacity>
  )
}

const SwipeButton = ({ iconName, width }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={FontAwesome} name={ iconName } style={{ color: '#ffffff' }} />
  </View>
)

const ItemTouchable = ({ children, ...otherProps }) => {

  const colorScheme = useColorScheme()
  const { colors } = useTheme()

  return (
    <TouchableHighlight
      style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}
      underlayColor={ colorScheme === 'dark' ? colors.gray['700'] : colors.gray['200'] }
      { ...otherProps }>
      { children }
    </TouchableHighlight>
  )
}

class TaskListItem extends Component {

  constructor(props) {
    super(props)
    this.swipeRow = React.createRef()

    this._onRowOpen = this._onRowOpen.bind(this)
    this._onRowClose = this._onRowClose.bind(this)
  }

  _onRowOpen(toValue) {
    if (toValue > 0 && this.props.onSwipedToLeft) {
      this.props.onSwipedToLeft()
    } else if (toValue < 0 && this.props.onSwipedToRight) {
      this.props.onSwipedToRight()
    }
  }

  _onRowClose() {
    if (this.props.onSwipeClosed) {
      this.props.onSwipeClosed()
    }
  }

  componentDidUpdate() {
    const { task } = this.props

    if (task.status === 'DONE') {
      this.swipeRow.current?.closeRow()
    }
  }

  render() {

    const { color, task, index } = this.props

    const itemStyle = []
    const textStyle = [styles.text]
    const itemProps = {}

    if (task.status === 'DONE' || task.status === 'FAILED') {
      itemProps.opacity = 0.4
    }

    if (task.status === 'FAILED') {
      textStyle.push(styles.textDanger)
    }

    const { width } = Dimensions.get('window')
    const buttonWidth = (width / 3)

    return (
      <SwipeRow
        disableRightSwipe={ this.props.disableRightSwipe }
        disableLeftSwipe={ this.props.disableLeftSwipe }
        leftOpenValue={ buttonWidth }
        stopLeftSwipe={ buttonWidth + 25 }
        rightOpenValue={ buttonWidth * -1 }
        stopRightSwipe={ (buttonWidth + 25) * -1 }
        onRowOpen={(toValue) => this._onRowOpen(toValue)}
        onRowClose={this._onRowClose}
        ref={ this.swipeRow }>
        <View style={ styles.rowBack }>
          <SwipeButtonContainer left
            onPress={ () => {
              this.swipeRow.current.closeRow()
              this.props.onPressLeft()
            }}
            testID={ `task:${index}:assign` }>
            <SwipeButton
              iconName={ this.props.swipeOutLeftIconName || doneIconName }
              width={ buttonWidth } />
          </SwipeButtonContainer>
          <SwipeButtonContainer right
            onPress={ () => {
              this.swipeRow.current.closeRow()
              this.props.onPressRight()
            }}>
            <SwipeButton
              iconName={ this.props.swipeOutRightIconName || failedIconName }
              width={ buttonWidth } />
          </SwipeButtonContainer>
        </View>
        <ItemTouchable
          onPress={ this.props.onPress }
          testID={ `task:${index}` }>
          <HStack flex={ 1 } alignItems="center" styles={ itemStyle } pr="3" { ...itemProps }>
            <View style={{ backgroundColor: color, width: 8, height: '100%', marginRight: 12 }}/>
            <View style={ styles.itemIcon }>
              <TaskTypeIcon task={ task } />
              <TaskStatusIcon task={ task } />
            </View>
            <VStack flex={ 1 } py="3" px="1">
              <Text style={ textStyle }><TaskTitle task={ task } /></Text>
              { task.orgName ? (<Text style={ textStyle }>{ task.orgName }</Text>) : null }
              { task.address.contactName ? (<Text style={ textStyle }>{ task.address.contactName }</Text>) : null }
              { task.address.name ? (<Text style={ textStyle }>{ task.address.name }</Text>) : null }
              <Text numberOfLines={ 1 } style={ textStyle }>{ task.address.streetAddress }</Text>
              <HStack alignItems="center">
                <Text pr="2" style={ textStyle }>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
                { task.comments && task.comments.length ? <Icon mr="2" as={FontAwesome} name="comments" size="xs"/> : null }
                {
                  task.metadata && task.metadata.payment_method &&
                  <View ml="2">
                    <PaymentMethodInfo fullDetail={false} paymentMethod={task.metadata.payment_method} />
                  </View>
                }
              </HStack>
            </VStack>
            <Icon as={ FontAwesome } name="arrow-right" size="sm" />
          </HStack>
        </ItemTouchable>
      </SwipeRow>
    )
  }
}

TaskListItem.defaultProps = {
  onPress: () => {},
  onPressLeft: () => {},
  onPressRight: () => {},
}

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
}

// We need to use "withRef" prop,
// for react-native-swipe-list-view CellRenderer to not trigger a warning
export default withTranslation(['common'], { withRef: true })(TaskListItem)
