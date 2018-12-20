import React, { Component } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Container, Content,
  Left, Right,
  Icon, Text, Button
} from 'native-base';
import moment from 'moment'
import _ from 'lodash'

import TaskList from '../../components/TaskList'
import LoaderOverlay from '../../components/LoaderOverlay'
import { unassignTask } from '../../redux/Dispatch/actions'

class TaskListScreen extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.taskLists !== prevProps.taskLists) {
      const { taskList } = this.props.navigation.state.params
      const thisTaskList = _.find(this.props.taskLists, aTaskList => aTaskList.username === taskList.username)
      if (thisTaskList) {
        this.props.navigation.setParams({ taskList: thisTaskList })
      }
    }
  }

  render() {

    const { taskList } = this.props.navigation.state.params
    const { navigate } = this.props.navigation

    return (
      <Container>
        <View>
          <Button iconLeft full
            onPress={ () => navigate('DispatchAssignTask', { username: taskList.username }) }>
            <Icon name="add" />
            <Text>{ this.props.t('DISPATCH_ASSIGN_TASK') }</Text>
          </Button>
        </View>
        <Content>
          <TaskList
            tasks={ taskList.items }
            onSwipeRight={ task => this.props.unassignTask(task) }
            swipeOutRightIconName="close"
            onTaskClick={ task => navigate('DispatchTask', { task }) } />
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.dispatch.isFetching,
    taskLists: state.dispatch.taskLists,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    unassignTask: task => dispatch(unassignTask(task)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TaskListScreen))
