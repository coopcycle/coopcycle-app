import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'

import { connect } from 'react-redux'

import TaskList from '../../components/TaskList'
import DateSelectHeader from '../../components/DateSelectHeader'
import { whiteColor, dateSelectHeaderHeight } from '../../styles/common'
import { withTranslation } from 'react-i18next'
import {
  loadTasks,
  selectTaskSelectedDate,
  selectFilteredTasks,
  selectIsTasksRefreshing,
  selectTasksWithColor
} from '../../redux/Courier'
import { navigateToTask, navigateToCompleteTask } from '../../navigation'

const styles = StyleSheet.create({
  containerEmpty: {
    alignItems: 'center',
    paddingTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: whiteColor,
    paddingTop: dateSelectHeaderHeight,
  },
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: whiteColor,
  },
  noTask: {
    fontSize: 16,
    textAlign: 'center',
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
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={ () => this.props.loadTasks(selectedDate) }>
              <Icon type="FontAwesome5" name="check-circle" solid style={{ marginBottom: 15, fontSize: 38, color: '#ecedec' }} />
              <Text style={ styles.noTask }>{ this.props.t('NO_TASKS') }</Text>
              <Text note>{ this.props.t('TOUCH_TO_RELOAD') }</Text>
            </TouchableOpacity>
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
