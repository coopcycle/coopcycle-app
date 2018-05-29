import React, { Component } from 'react'
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment/min/moment-with-locales'
import _ from 'lodash'
import { translate } from 'react-i18next'

import { whiteColor, lightGreyColor, redColor } from "../styles/common"
import { localeDetector } from '../i18n'

moment.locale(localeDetector())

const styles = StyleSheet.create({
  itemLeftRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  itemBody: {
    padding: 10
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: lightGreyColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  disabled: {
    opacity: 0.4
  },
  text: {
    fontSize: 14
  },
  textDanger: {
    color: redColor
  },
  icon: {
    fontSize: 18
  },
  iconDanger: {
    color: redColor
  }
})

class TaskList extends Component {

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

  renderTaskStatusIcon(task) {
    let iconStyle = [ styles.icon ]
    switch (task.status) {
      case 'DONE':
        return (
          <Icon style={ iconStyle } name="checkmark" />
        )
      case 'FAILED':
        iconStyle.push(styles.iconDanger)
        return (
          <Icon style={ iconStyle } name="warning" />
        )
      default:
        return (
          <View />
        )
    }
  }

  renderTaskItemLeft(task) {

  }

  renderItem(task) {

    const { onTaskClick } = this.props

    const taskTypeIcon = task.type === 'PICKUP' ? 'cube' : 'arrow-down'
    const isCompleted = _.includes(['DONE', 'FAILED'], task.status)

    let itemLeftStyle = [ styles.itemLeftRight ]
    let itemBodyStyle = [ styles.itemBody ]
    let textStyle = [ styles.text ]
    let iconStyle = [ styles.icon ]

    if (task.status === 'DONE') {
      itemLeftStyle.push(styles.disabled)
      itemBodyStyle.push(styles.disabled)
    }
    if (task.status === 'FAILED') {
      textStyle.push(styles.textDanger)
      iconStyle.push(styles.iconDanger)
      itemLeftStyle.push(styles.disabled)
      itemBodyStyle.push(styles.disabled)
    }

    const name = [ task.address.firstName, task.address.lastName ].filter(function (item) {return item}).join(' ')

    return (
      <TouchableOpacity onPress={ () => onTaskClick(task) } style={ styles.item }>
        <Grid>
          <Col size={ 1 } style={ itemLeftStyle }>
            <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon style={ iconStyle } name={ taskTypeIcon } />
            </Row>
            { isCompleted &&
            <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            { this.renderTaskStatusIcon(task) }
            </Row>
            }
          </Col>
          <Col size={ 10 } style={ itemBodyStyle }>
            <Text style={ textStyle }>{this.props.t('TASK')} #{ task.id }</Text>
            { name && (<Text style={ textStyle }>{ name }</Text>) }
            { task.address.name && (<Text style={ textStyle }>{ task.address.name }</Text>) }
            <Text numberOfLines={ 1 } style={ textStyle }>{ task.address.streetAddress }</Text>
            <Text style={ textStyle }>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
          </Col>
          <Col size={ 1 } style={ styles.itemLeftRight }>
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
      <FlatList
        ref="flatList"
        onScrollToIndexFailed={ e => console.log('onScrollToIndexFailed', e) }
        data={tasks}
        keyExtractor={(item, index) => item['@id']}
        renderItem={({item}) => this.renderAnimatedItem(item)}
      />
    )
  }
}

export default translate(['common'], { withRef: true })(TaskList)
