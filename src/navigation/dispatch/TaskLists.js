import React, { Component } from 'react'
import { FlatList, InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import {
  Container, Content,
  Left, Right,
  Icon, Text, Button,
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment'

import TaskList from '../../components/TaskList'
import { createTaskList } from '../../redux/Dispatch/actions'
import { selectTasksNotCancelled } from '../../redux/Dispatch/selectors'

class TaskLists extends Component {

  renderItem(taskList) {

    const { navigate } = this.props.navigation
    const items = selectTasksNotCancelled({ tasks: taskList.items })

    return (
      <TouchableOpacity onPress={ () => navigate('DispatchTaskList', { taskList }) } style={ styles.item }>
        <Grid>
          <Col size={ 2 }>
            <View style={ [ styles.verticalAlign ] }>
              <Icon style={{ color: '#ccc' }} name="person" />
            </View>
          </Col>
          <Col size={ 9 }>
            <View style={ [ styles.verticalAlign ] }>
              <Text>{ taskList.username } ({ items.length })</Text>
            </View>
          </Col>
          <Col size={ 1 }>
            <View style={ [ styles.verticalAlign, { alignItems: 'flex-end' } ] }>
              <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
            </View>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <View>
          <Button iconLeft full
            onPress={ () => navigate('DispatchPickUser', { onUserPicked: user => this.props.createTaskList(this.props.date, user) }) }>
            <Icon name="add" />
            <Text>{ this.props.t('DISPATCH_ADD_TASK_LIST') }</Text>
          </Button>
        </View>
        <Content>
          <FlatList
            data={ this.props.taskLists }
            keyExtractor={ (item, index) => item.username }
            renderItem={ ({ item }) => this.renderItem(item) } />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  verticalAlign: {
    flex: 1,
    justifyContent: 'center',
  },
})

function mapStateToProps(state) {
  return {
    taskLists: state.dispatch.taskLists,
    date: state.dispatch.date,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTaskList: (date, user) => dispatch(createTaskList(date, user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskLists))
