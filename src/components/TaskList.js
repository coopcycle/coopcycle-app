import React, { Component } from 'react'
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, Content, Icon, Text, Thumbnail } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment/min/moment-with-locales'

import { whiteColor, lightGreyColor } from "../styles/common"

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
  }
})

export default class TaskList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      opacityAnim: new Animated.Value(1)
    }
  }

  animate() {
    Animated.sequence([
      Animated.timing(this.state.opacityAnim, {
        toValue: 0.4,
        duration: 300,
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 0.4,
        duration: 300,
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: 200,
      }),
    ]).start()
  }

  renderAnimatedItem(task) {

    const { tasksToHighlight } = this.props
    const { opacityAnim } = this.state

    const isHighlighted = _.find(tasksToHighlight, t => t['@id'] === task['@id'])

    if (isHighlighted) {
      return (
        <Animated.View style={{ opacity: opacityAnim }}>
          { this.renderItem(task) }
        </Animated.View>
      )
    }

    return this.renderItem(task)
  }

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

  scrollToTask(task) {
    const { tasks } = this.props
    const taskIndex = _.findIndex(tasks, t => t['@id'] === task['@id'])
    this.refs.flatList.scrollToIndex({ index: taskIndex, viewPosition: 0.5, viewOffset: 0 })
  }

  render() {
    let { tasks } = this.props

    return (
      <Container style={ styles.container }>
        <Content>
          <View style={ styles.wrapper }>
          {
            tasks.length > 0 &&
            <FlatList
              ref="flatList"
              onScrollToIndexFailed={ e => console.log('onScrollToIndexFailed', e) }
              data={tasks}
              keyExtractor={(item, index) => item['@id']}
              renderItem={({item}) => this.renderAnimatedItem(item)}
            />
          }
          {
            tasks.length === 0 &&
            <Text style={ styles.noTask }>Pas de tâches prévues aujourd'hui !</Text>
          }
          </View>
        </Content>
      </Container>
    )
  }
}