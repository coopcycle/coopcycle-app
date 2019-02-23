import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import {
  Container, Content,
  Left, Right,
  Icon, Text, Button
} from 'native-base';
import moment from 'moment'

import TaskList from '../../components/TaskList'
import { assignTask } from '../../redux/Dispatch/actions'

class AssignTask extends Component {

  render() {

    const { username } = this.props.navigation.state.params
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
        <Content { ...contentProps }>
          { isEmpty && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text note>{ this.props.t('DISPATCH_NO_TASKS') }</Text>
            </View>
          ) }
          { !isEmpty && (
            <TaskList
              tasks={ this.props.unassignedTasks }
              onTaskClick={ task => this.props.assignTask(task, username) } />
          ) }
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    unassignedTasks: state.dispatch.unassignedTasks,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task, username) => dispatch(assignTask(task, username)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(AssignTask))
