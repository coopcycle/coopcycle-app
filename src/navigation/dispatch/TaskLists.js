import React, { Component } from 'react'
import { FlatList, InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Container, Content,
  Left, Right,
  Icon, Text, Button,
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment'

import TaskList from '../../components/TaskList'

class TaskLists extends Component {

  renderItem(taskList) {

    const { navigate } = this.props.navigation

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
              <Text>{ taskList.username } ({ taskList.items.length })</Text>
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

    return (
      <Container>
        <View>
          <Button iconLeft full onPress={ () => this.props.navigation.navigate('DispatchAddUser') }>
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
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  verticalAlign: {
    flex: 1,
    justifyContent: 'center'
  },
})

function mapStateToProps(state) {
  return {
    taskLists: state.dispatch.taskLists,
    date: state.dispatch.date,
  }
}

export default connect(mapStateToProps)(translate()(TaskLists))
