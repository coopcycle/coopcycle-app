import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Icon, Text } from 'native-base'

import ItemSeparatorComponent from '../../components/ItemSeparator'
import Avatar from '../../components/Avatar'
import AddButton from './components/AddButton'
import { createTaskList } from '../../redux/Dispatch/actions'
import { selectTasksNotCancelled } from '../../redux/Dispatch/selectors'

class TaskLists extends Component {

  _createTaskList(user) {
    this.props.navigation.navigate('DispatchTaskLists')
    this.props.createTaskList(this.props.date, user)
  }

  renderItem(taskList) {

    const { navigate } = this.props.navigation
    const items = selectTasksNotCancelled({ tasks: taskList.items })

    return (
      <TouchableOpacity onPress={ () => navigate('DispatchTaskList', { taskList }) } style={ styles.item }
        testID={ `dispatch:taskLists:${taskList.username}` }>
        <Avatar baseURL={ this.props.baseURL } username={ taskList.username } />
        <Text style={ styles.itemLabel }>{ taskList.username } ({ items.length })</Text>
        <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
      </TouchableOpacity>
    )
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <View style={{ flex: 1 }}>
        <View>
          <AddButton
            onPress={ () => navigate('DispatchPickUser', {
              onItemPress: user => this._createTaskList(user),
              withSelfAssignBtn: false,
            }) }>
            <Text style={{ fontWeight: '700' }}>{ this.props.date.format('ll') }</Text>
          </AddButton>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={ this.props.taskLists }
            keyExtractor={ (item, index) => item.username }
            renderItem={ ({ item }) => this.renderItem(item) }
            ItemSeparatorComponent={ ItemSeparatorComponent } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  itemLabel: {
    flex: 1,
    paddingHorizontal: 10,
  },
  verticalAlign: {
    flex: 1,
    justifyContent: 'center',
  },
})

function mapStateToProps(state) {
  return {
    baseURL: state.app.baseURL,
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
