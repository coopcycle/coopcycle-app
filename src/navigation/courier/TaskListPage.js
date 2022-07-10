import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { connect } from 'react-redux'

import TaskList from '../../components/TaskList'
import TapToRefresh from '../../components/TapToRefresh'
import DateSelectHeader from '../../components/DateSelectHeader'
import { dateSelectHeaderHeight } from '../../styles/common'
import { withTranslation } from 'react-i18next'
import {
  loadTasks,
  selectFilteredTasks,
  selectIsTasksRefreshing,
  selectTaskSelectedDate,
  selectTasksWithColor,
} from '../../redux/Courier'
import { navigateToCompleteTask, navigateToTask } from '../../navigation/utils'

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

  render() {

    const { tasks, tasksWithColor, selectedDate } = this.props

    const containerStyle = [ styles.container ]
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
            onSwipeLeft={ task => navigateToCompleteTask(this.props.navigation, this.props.route, task, tasks, true) }
            onSwipeRight={ task => navigateToCompleteTask(this.props.navigation, this.props.route, task, tasks, false) }
            swipeOutLeftEnabled={ task => task.status !== 'DONE' }
            swipeOutRightEnabled={ task => task.status !== 'DONE' }
            onTaskClick={ task => navigateToTask(this.props.navigation, this.props.route, task, tasks) }
            refreshing={ this.props.isRefreshing }
            onRefresh={ () => this.props.refreshTasks(selectedDate) }
          />
        }
        {
          tasks.length === 0 &&
            <TapToRefresh
              onPress={ () => this.props.loadTasks(selectedDate) } />
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
