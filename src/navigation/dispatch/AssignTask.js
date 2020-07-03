import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Container, Content, Text } from 'native-base'

import TaskList from '../../components/TaskList'
import { assignTask } from '../../redux/Dispatch/actions'
import { selectTasksWithColor } from '../../redux/Dispatch/selectors'

class AssignTask extends Component {

  render() {

    const { username } = this.props.navigation.state.params
    const isEmpty = this.props.unassignedTasks.length === 0

    let contentProps = {}
    if (isEmpty) {
      contentProps = {
        flex: 1,
        justifyContent: 'center',
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
              tasksWithColor={ this.props.tasksWithColor }
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
    tasksWithColor: selectTasksWithColor(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task, username) => dispatch(assignTask(task, username)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AssignTask))
