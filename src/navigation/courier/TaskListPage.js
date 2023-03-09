import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'

import TaskList from '../../components/TaskList'
import TapToRefresh from '../../components/TapToRefresh'
import DateSelectHeader from '../../components/DateSelectHeader'
import { dateSelectHeaderHeight, greenColor } from '../../styles/common'
import { withTranslation } from 'react-i18next'
import {
  loadTasks,
  selectFilteredTasks,
  selectIsTasksRefreshing,
  selectTaskSelectedDate,
  selectTasksWithColor,
} from '../../redux/Courier'
import { navigateToCompleteTask, navigateToTask } from '../../navigation/utils'
import { Fab, Icon } from 'native-base'
import { doneIconName } from '../task/styles/common'

const styles = StyleSheet.create({
  containerEmpty: {
    alignItems: 'center',
    paddingTop: 0,
  },
  container: {
    flex: 1,
    paddingTop: dateSelectHeaderHeight,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
})

class TaskListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedTasks: [],
    }

    this.onFocus = this.onFocus.bind(this);

    props.navigation.addListener('focus', this.onFocus);
  }

  onFocus() {
    if (this.state.selectedTasks.length) {
      this.setState({ selectedTasks: [] })
    }
  }

  _toggleTaskSelection(task, isSelected) {
    if (isSelected) {
      this.setState({
        selectedTasks: [ ...this.state.selectedTasks, task ],
      })
    } else {
      this.setState({
        selectedTasks: this.state.selectedTasks.filter((t) => t.id !== task.id),
      })
    }
  }

  completeSelectedTasks() {
    navigateToCompleteTask(this.props.navigation, this.props.route, null, this.state.selectedTasks, true)
    this.setState({ selectedTasks: [] })
  }

  render() {

    const { tasks, tasksWithColor, selectedDate } = this.props

    const containerStyle = [styles.container]
    if (tasks.length === 0) {
      containerStyle.push(styles.containerEmpty)
    }

    return (
      <View style={ containerStyle }>
        {
          tasks.length > 0 &&
          <TaskList
            tasks={ tasks }
            tasksWithColor={ tasksWithColor }
            onSwipeLeft={ task => navigateToCompleteTask(this.props.navigation, this.props.route, task, [], true) }
            onSwipeRight={ task => navigateToCompleteTask(this.props.navigation, this.props.route, task, [], false) }
            swipeOutLeftEnabled={ task => task.status !== 'DONE' }
            swipeOutRightEnabled={ task => task.status !== 'DONE' }
            onTaskClick={ task => navigateToTask(this.props.navigation, this.props.route, task, tasks) }
            refreshing={ this.props.isRefreshing }
            onRefresh={ () => this.props.refreshTasks(selectedDate) }
            toggleTaskSelection={ (task, isSelected) =>  this._toggleTaskSelection(task, isSelected) }
          />
        }
        {
          tasks.length === 0 &&
            <TapToRefresh
              onPress={ () => this.props.loadTasks(selectedDate) } />
        }
        {
          this.state.selectedTasks.length ?
          <Fab renderInPortal={false} shadow={2} size="sm" backgroundColor={ greenColor }
            icon={<Icon color="white" as={FontAwesome} name={doneIconName} size="sm"
            onPress={ () => this.completeSelectedTasks() } />} /> : null
        }
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={ date => this.props.loadTasks(date) }
          selectedDate={selectedDate}/>
      </View>
    )
  }
}

function mapStateToProps (state) {
  return {
    tasks: selectFilteredTasks(state),
    tasksWithColor: selectTasksWithColor(state),
    selectedDate: selectTaskSelectedDate(state),
    isRefreshing: selectIsTasksRefreshing(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (selectedDate) => dispatch(loadTasks(selectedDate)),
    refreshTasks: (selectedDate) => dispatch(loadTasks(selectedDate, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskListPage))
