import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, Content, Icon, Text, Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment/min/moment-with-locales'

import { primaryColor, whiteColor, lightGreyColor } from "../styles/common"

moment.locale('fr')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: whiteColor
  },
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: whiteColor
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: lightGreyColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  noTask: {
    paddingVertical: 30,
    textAlign: 'center'
  },
  dateHeader: {
    backgroundColor: primaryColor,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateHeaderText: {
    color: whiteColor
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
    let { tasks } = this.props
    let currentDate = moment()

    return (
      <Container style={ styles.container }>
        <Content>
          <View style={ styles.dateHeader }>
            <Text style={ styles.dateHeaderText }>{currentDate.format('dddd Do MMM')}</Text>
          </View>
          <View style={ styles.wrapper }>
          {
            tasks.length > 0 &&
            <FlatList
              data={tasks}
              keyExtractor={(item, index) => item['@id']}
              renderItem={({item}) => this.renderItem(item)}
            />
          }
          {
            tasks.length === 0 &&
            <Text style={ styles.noTask }>Pas de tâches prévues aujourd'hui!</Text>
          }
          </View>
        </Content>
      </Container>
    )
  }
}