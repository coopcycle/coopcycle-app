import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import PropTypes from 'prop-types'
import { Fab, Icon } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import ItemSeparatorComponent from './ItemSeparator'
import TaskListItem from './TaskListItem'
import { greenColor, whiteColor } from '../styles/common'

class TaskList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedTasks: [],
    }

    this.onFabButtonPressed = this.onFabButtonPressed.bind(this)
  }

  _toggleTaskSelection(task, isSelected) {
    if (this.props.allowMultipleSelection(task)) {
      if (isSelected) {
        this.setState({
          selectedTasks: [ ...this.state.selectedTasks, task ],
        },)
      } else {
        this.setState({
          selectedTasks: this.state.selectedTasks.filter((t) => t.id !== task.id),
        },)
      }
    }
  }

  _onTaskClick(task) {
    if (this.props.refreshing) {
      return
    }
    this.props.onTaskClick(task)
  }

  taskColor(task) {
    let tasksWithColor = this.props.tasksWithColor ?? []

    return Object.prototype.hasOwnProperty.call(tasksWithColor, task['@id']) ?
      this.props.tasksWithColor[task['@id']] : '#ffffff'
  }

  renderItem(task, index) {

    let swipeOutRightEnabled = true
    if (typeof this.props.swipeOutRightEnabled === 'function') {
      swipeOutRightEnabled = this.props.swipeOutRightEnabled(task)
    }

    let swipeOutLeftEnabled = false
    if (typeof this.props.swipeOutLeftEnabled === 'function') {
      swipeOutLeftEnabled = this.props.swipeOutLeftEnabled(task)
    }

    const hasOnSwipeLeft = typeof this.props.onSwipeLeft === 'function' && swipeOutLeftEnabled
    const hasOnSwipeRight = typeof this.props.onSwipeRight === 'function' && swipeOutRightEnabled

    return (
      <TaskListItem
        task={ task } index={ index }
        color={ this.taskColor(task) }
        onPress={ () => this._onTaskClick(task) }
        onPressLeft={ () => {
          this.props.onSwipeLeft(task)
        }}
        onPressRight={ () => {
          this.props.onSwipeRight(task)
        }}
        disableRightSwipe={ !hasOnSwipeLeft }
        disableLeftSwipe={ !hasOnSwipeRight }
        swipeOutLeftIconName={ this.props.swipeOutLeftIconName }
        swipeOutRightIconName={ this.props.swipeOutRightIconName }
        isSelected={ this.state.selectedTasks.findIndex(t => t.id === task.id) !== -1 }
        toggleItemSelection={ this.props.allowMultipleSelection && this.props.allowMultipleSelection(task) ? (isSelected) => this._toggleTaskSelection(task, isSelected) : null } />
    )
  }

  onFabButtonPressed() {
    this.props.onMultipleSelectionAction(this.state.selectedTasks)
    this.setState({ selectedTasks: [] })
  }

  render() {

    const { refreshing, onRefresh } = this.props

    return (
      <>
        <SwipeListView
          data={ this.props.tasks }
          keyExtractor={ (item, index) => item['@id'] }
          renderItem={({ item, index }) => this.renderItem(item, index)}
          refreshing={ refreshing }
          onRefresh={ onRefresh }
          ItemSeparatorComponent={ ItemSeparatorComponent } />
        {
          this.state.selectedTasks.length ?
          <Fab renderInPortal={false} shadow={2} size="sm" backgroundColor={ greenColor }
            icon={<Icon color={ whiteColor } as={FontAwesome} name={this.props.multipleSelectionIcon} size="sm"
            onPress={ () => this.onFabButtonPressed() } />} /> : null
        }
      </>
    )
  }
}

TaskList.defaultProps = {
  refreshing: false,
  onRefresh: () => {},
}

TaskList.propTypes = {
  onTaskClick: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
}

export default TaskList
