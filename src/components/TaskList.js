import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text, Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment/min/moment-with-locales'

moment.locale('fr')

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

export default class TaskList extends Component {

  renderItem(task) {

    const { onTaskClick } = this.props

    const taskTypeIcon = task.type === 'PICKUP' ? 'arrow-up' : 'arrow-down'

    let taskStatusIcon = 'list'
    if (task.status === 'DONE') {
      taskStatusIcon = 'checkmark'
    }
    if (task.status === 'FAILED') {
      taskStatusIcon = 'warning'
    }

    let style = [ styles.item ]

    return (
      <TouchableOpacity onPress={ () => onTaskClick(task) } style={ style }>
        <Grid>
          <Col size={ 1 } style={{ paddingHorizontal: 5, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon style={{ fontSize: 14 }} name={ taskTypeIcon } />
            </Row>
            <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon style={{ fontSize: 14 }} name={ taskStatusIcon } />
            </Row>
          </Col>
          <Col size={ 10 } style={{ padding: 10 }}>
            <Text style={{ fontSize: 14 }}>{ task.address.streetAddress }</Text>
            <Text style={{ fontSize: 14 }}>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
          </Col>
          <Col size={ 1 } style={{ paddingHorizontal: 5, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={ styles.wrapper }>
        <FlatList
          data={ this.props.tasks }
          keyExtractor={ (item, index) => item['@id'] }
          renderItem={ ({ item }) => this.renderItem(item) } />
      </View>
    )
  }
}