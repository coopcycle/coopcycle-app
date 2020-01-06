import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'

import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

import TaskList from '../../components/TaskList'
import DateSelectHeader from '../../components/DateSelectHeader'
import { whiteColor, dateSelectHeaderHeight } from '../../styles/common'
import { withTranslation } from 'react-i18next'
import {
  loadTasks,
  selectTaskSelectedDate,
  selectFilteredTasks,
  selectIsTasksRefreshing,
} from '../../redux/Courier'

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

    const { tasks, selectedDate } = this.props
    const { navigate } = this.props.navigation

    const navigateParams = {
      navigateAfter: this.props.navigation.state.routeName,
    }

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
            onSwipeLeft={ task => navigate(
              'Task',
              { ...navigateParams, task },
              NavigationActions.navigate({ routeName: 'TaskComplete', params: { ...navigateParams, task, success: true } })
            ) }
            onSwipeRight={ task => navigate(
              'Task',
              { ...navigateParams, task },
              NavigationActions.navigate({ routeName: 'TaskComplete', params: { ...navigateParams, task, success: false } })
            ) }
            swipeOutLeftEnabled={ task => task.status !== 'DONE' }
            swipeOutRightEnabled={ task => task.status !== 'DONE' }
            onTaskClick={ task => navigate('Task', { ...navigateParams, task }) }
            refreshing={ this.props.isRefreshing }
            onRefresh={ () => this.props.refreshTasks(this.props.httpClient, selectedDate) }
          />
        }
        {
          tasks.length === 0 &&
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={ () => this.props.loadTasks(this.props.httpClient, selectedDate) }>
              <Icon type="FontAwesome5" name="check-circle" solid style={{ marginBottom: 15, fontSize: 38, color: '#ecedec' }} />
              <Text style={ styles.noTask }>{ this.props.t('NO_TASKS') }</Text>
              <Text note>{ this.props.t('TOUCH_TO_RELOAD') }</Text>
            </TouchableOpacity>
        }
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={ date => this.props.loadTasks(this.props.httpClient, date) }
          selectedDate={selectedDate}/>
      </View>
    )
  }
}

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    tasks: selectFilteredTasks(state),
    selectedDate: selectTaskSelectedDate(state),
    isRefreshing: selectIsTasksRefreshing(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (client, selectedDate) => dispatch(loadTasks(client, selectedDate)),
    refreshTasks: (client, selectedDate) => dispatch(loadTasks(client, selectedDate, true)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskListPage))
