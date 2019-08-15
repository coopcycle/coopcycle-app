import React, { Component } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import {
  Container, Content,
  Left, Right,
  Icon, Text, Button
} from 'native-base';
import moment from 'moment'

import TaskList from '../../components/TaskList'
import { assignTask, initialize } from '../../redux/Dispatch/actions'

class UnassignedTasks extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.initialize()
    })
  }

  render() {

    const { assignTask, date, user } = this.props
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
          <Button iconLeft full onPress={ () => this.props.navigation.navigate('DispatchAddTask') } testID="addTask">
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
              onSwipeLeft={ task => navigate('DispatchPickUser', { onUserPicked: user => assignTask(task, user.username) }) }
              swipeOutLeftIconName="person"
              onTaskClick={ task => navigate('Task', { task }) } />
          ) }
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {

  return {
    unassignedTasks: _.uniqBy(state.dispatch.unassignedTasks, '@id'),
    date: state.dispatch.date,
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task, username) => dispatch(assignTask(task, username)),
    initialize: () => dispatch(initialize()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UnassignedTasks))
