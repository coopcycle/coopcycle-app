import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, TouchableHighlight, View, Dimensions } from 'react-native'
import { Icon, Text } from 'native-base'
import { SwipeRow } from 'react-native-swipe-list-view'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

import { greenColor, redColor } from '../styles/common'
import {
  doneIconName,
  failedIconName,
  taskTypeIconName,
} from '../navigation/task/styles/common'

const styles = StyleSheet.create({
  itemBody: {
    paddingHorizontal: 5,
    width: '80%',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  disabled: {
    opacity: 0.4,
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

const TaskStatusIcon = ({ task }) => {
  const iconStyle = [ styles.icon ]

  switch (task.status) {
    case 'DONE':
      return (
        <Icon type="FontAwesome" name={ doneIconName } style={ iconStyle } />
      )
    case 'FAILED':
      iconStyle.push(styles.iconDanger)
      return (
        <Icon type="FontAwesome" name={ failedIconName } style={ iconStyle } />
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
    <Icon type="FontAwesome" name={ iconName } style={{ color: '#ffffff' }} />
  </View>
)

class TaskListItem extends Component {

  constructor(props) {
    super(props)
    this.swipeRow = React.createRef()
  }

  render() {

    const { task, index } = this.props

    const taskTypeIcon = taskTypeIconName(task)
    const isCompleted = _.includes(['DONE', 'FAILED'], task.status)

    const itemStyle = [ styles.item ]
    const textStyle = [ styles.text ]
    const iconStyle = [ styles.icon ]

    if (task.status === 'DONE' || task.status === 'FAILED') {
      itemStyle.push(styles.disabled)
    }

    if (task.status === 'FAILED') {
      textStyle.push(styles.textDanger)
      iconStyle.push(styles.iconDanger)
    }

    let name
    const customerDetails = _.filter([ task.address.firstName, task.address.lastName ])
    if (customerDetails.length > 0) {
      name = customerDetails.join(' ')
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
        <TouchableHighlight
          onPress={ this.props.onPress }
          style={ styles.itemContainer }
          underlayColor={ '#efefef' }
          testID={ `task:${index}` }>
          <View style={ itemStyle }>
            <View style={{ alignItems: 'center' }}>
              <Icon type="FontAwesome" style={ iconStyle } name={ taskTypeIcon } />
              { isCompleted && <TaskStatusIcon task={ task } /> }
            </View>
            <View style={ styles.itemBody }>
              <Text style={ textStyle }>{ this.props.t('TASK_WITH_ID', { id: task.id }) }</Text>
              { name ? (<Text style={ textStyle }>{ name }</Text>) : null }
              { task.address.name ? (<Text style={ textStyle }>{ task.address.name }</Text>) : null }
              <Text numberOfLines={ 1 } style={ textStyle }>{ task.address.streetAddress }</Text>
              <Text style={ textStyle }>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
            </View>
            <Icon style={{ color: '#cccccc' }} name="ios-arrow-forward" />
          </View>
        </TouchableHighlight>
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
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
}

// We need to use "withRef" prop,
// for react-native-swipe-list-view CellRenderer to not trigger a warning
export default withTranslation([ 'common' ], { withRef: true })(TaskListItem)
