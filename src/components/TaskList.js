import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import PropTypes from 'prop-types'

import ItemSeparatorComponent from './ItemSeparator'
import TaskListItem from './TaskListItem'
import ItemsBulkFabButton from './ItemsBulkFabButton'

class TaskList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedTasks: [],
    }

    this.bulkFabButton = React.createRef()

    this.onFabButtonPressed = this.onFabButtonPressed.bind(this)
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

  _handleSwipeToLeft(task) {
    this.bulkFabButton.current?.addItem(task)
  }

  _handleSwipeClosed(task) {
    this.bulkFabButton.current?.removeItem(task)
  }

  componentDidUpdate() {
    const { tasks } = this.props
    const doneTasks = tasks.filter((t) => t.status !== 'DONE')

    // Fab button shouldn't handle DONE tasks
    this.bulkFabButton.current?.updateItems(doneTasks)
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
        onSwipedToLeft={() => this._handleSwipeToLeft(task)}
        onSwipeClosed={ () => this._handleSwipeClosed(task)}
        disableRightSwipe={ !hasOnSwipeLeft }
        disableLeftSwipe={ !hasOnSwipeRight }
        swipeOutLeftIconName={ this.props.swipeOutLeftIconName }
        swipeOutRightIconName={ this.props.swipeOutRightIconName } />
    )
  }

  onFabButtonPressed(tasks) {
    this.props.onMultipleSelectionAction(tasks)
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
        <ItemsBulkFabButton
          iconName={ this.props.multipleSelectionIcon }
          onPressed={ (items) => this.onFabButtonPressed(items) }
          ref={ this.bulkFabButton }
          />
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
