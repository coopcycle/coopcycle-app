import React, { Component } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'
import {
  Container, Content,
  Left, Right,
  Icon, Text, Button
} from 'native-base';
import moment from 'moment'

import TaskList from '../../components/TaskList'
import LoaderOverlay from '../../components/LoaderOverlay'
import { loadUnassignedTasks, assignTask, loadTasks } from '../../redux/Dispatch/actions'

class UnassignedTasks extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadTasks(this.props.date)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.date !== prevProps.date) {
      this.props.loadTasks(this.props.date)
    }
  }

  render() {

    const { navigate } = this.props.navigation
    const isEmpty = this.props.unassignedTasks.length === 0

    let contentProps = {}
    if (isEmpty) {
      contentProps = {
        flex: 1,
        justifyContent: 'center'
      }
    }

    return (
      <Container>
        <View>
          <Button iconLeft full onPress={ () => this.props.navigation.navigate('DispatchAddTask') }>
            <Icon name="add" />
            <Text>{ this.props.t('DISPATCH_CREATE_TASK') }</Text>
          </Button>
        </View>
        <Content { ...contentProps }>
          { isEmpty && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text note>{ this.props.t('DISPATCH_NO_TASKS') }</Text>
            </View>
          ) }
          { !isEmpty && (
            <TaskList
              tasks={ this.props.unassignedTasks }
              onSwipeLeft={ task => this.props.assignTask(task, this.props.user.username) }
              onTaskClick={ task => navigate('Task', { task }) } />
          ) }
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    );
  }
}

function mapStateToProps(state) {

  return {
    loading: state.dispatch.isFetching,
    unassignedTasks: _.uniqBy(state.dispatch.unassignedTasks, '@id'),
    date: state.dispatch.date,
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUnassignedTasks: date => dispatch(loadUnassignedTasks(date)),
    loadTasks: date => dispatch(loadTasks(date)),
    assignTask: (task, username) => dispatch(assignTask(task, username)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UnassignedTasks))
