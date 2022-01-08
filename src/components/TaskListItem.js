import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, TouchableHighlight, View, Dimensions, Appearance, useColorScheme } from 'react-native'
import { Icon, Text, HStack, VStack } from 'native-base'
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

const styles = StyleSheet.create({
  itemIcon: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
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

const iconStyle = task => {
  const style = [ styles.icon ]
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

  return (
    <TouchableHighlight
      style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}
      { ...otherProps }>
      { children }
    </TouchableHighlight>
  )
}

class TaskListItem extends Component {

  constructor(props) {
    super(props)
    this.swipeRow = React.createRef()
  }

  render() {

    const colorScheme = Appearance.getColorScheme()
    const { color, task, index } = this.props

    const itemStyle = []
    const textStyle = [ styles.text ]

    if (task.status === 'DONE' || task.status === 'FAILED') {
      itemStyle.push(styles.disabled)
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
          <HStack flex={ 1 } alignItems="center" styles={ itemStyle } pr="3">
            <View style={{backgroundColor: color, width: 8, height: '100%', marginRight: 12}}/>
            <View style={ styles.itemIcon }>
              <TaskTypeIcon task={ task } />
              <TaskStatusIcon task={ task } />
            </View>
            <VStack flex={ 1 } py="3" px="1">
              <Text style={ textStyle }><TaskTitle task={ task } /></Text>
              { task.address.contactName ? (<Text style={ textStyle }>{ task.address.contactName }</Text>) : null }
              { task.address.name ? (<Text style={ textStyle }>{ task.address.name }</Text>) : null }
              <Text numberOfLines={ 1 } style={ textStyle }>{ task.address.streetAddress }</Text>
              <Text style={ textStyle }>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
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
export default withTranslation([ 'common' ], { withRef: true })(TaskListItem)
