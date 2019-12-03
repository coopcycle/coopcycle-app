import React, { Component } from 'react'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import Swipeout from 'react-native-swipeout'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

import { greenColor, lightGreyColor, redColor } from '../styles/common'
import {
  doneIconName,
  failedIconName,
  taskTypeIconName
} from '../navigation/task/styles/common'

const styles = StyleSheet.create({
  itemLeftRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  itemBody: {
    padding: 10,
  },
  item: {
    borderBottomColor: lightGreyColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 14,
  },
  textDanger: {
    color: redColor,
  },
  icon: {
    fontSize: 18,
  },
  iconDanger: {
    color: redColor,
  },
})

class TaskList extends Component {

  constructor(props) {
    super(props)
  }

  _onTaskClick(task) {
    if (this.props.refreshing) {
      return
    }
    this.props.onTaskClick(task)
  }

  renderTaskStatusIcon(task) {
    let iconStyle = [ styles.icon ]
    switch (task.status) {
      case 'DONE':
        return (
          <Icon type="FontAwesome" name={ doneIconName } style={ iconStyle } />
        )
      case 'FAILED':
        iconStyle.push(styles.iconDanger)
        return (
          <Icon type="FontAwesome" name={ failedIconName } style={ iconStyle } />
        )
      default:
        return (
          <View />
        )
    }
  }

  renderSwipeoutButton(iconName) {

    return (
      <View style={{ flex: 1, height: 400, alignItems: 'center', justifyContent: 'center' }}>
        <Icon type="FontAwesome" name={ iconName } style={{ color: '#fff' }} />
      </View>
    )
  }

  renderSwipeoutLeftButton() {

    return this.renderSwipeoutButton(this.props.swipeOutLeftIconName || doneIconName)
  }

  renderSwipeoutRightButton() {

    return this.renderSwipeoutButton(this.props.swipeOutRightIconName || failedIconName)
  }

  renderItem(task) {

    const { width } = Dimensions.get('window')

    const taskTypeIcon = taskTypeIconName(task)
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

    let name
    const customerDetails = _.filter([ task.address.firstName, task.address.lastName ])
    if (customerDetails.length > 0) {
      name = customerDetails.join(' ')
    }

    let swipeOutRightEnabled = true
    if (typeof this.props.swipeOutRightEnabled === 'function') {
      swipeOutRightEnabled = this.props.swipeOutRightEnabled(task)
    }

    let swipeOutLeftEnabled = false
    if (typeof this.props.swipeOutLeftEnabled === 'function') {
      swipeOutLeftEnabled = this.props.swipeOutLeftEnabled(task)
    }

    const hasOnSwipeLeft = typeof this.props.onSwipeLeft === 'function' && swipeOutLeftEnabled
    const hasOnSwipeRight = typeof this.props.onSwipeRight === 'function' && swipeOutRightEnabled

    let swipeOutProps = {}
    if (hasOnSwipeLeft) {
      swipeOutProps = {
        ...swipeOutProps,
        left: [
          {
            component: this.renderSwipeoutLeftButton(),
            backgroundColor: greenColor,
            onPress: () => this.props.onSwipeLeft(task),
          },
        ],
      }
    }

    if (hasOnSwipeRight) {
      swipeOutProps = {
        ...swipeOutProps,
        right: [
          {
            component: this.renderSwipeoutRightButton(),
            backgroundColor: redColor,
            onPress: () => this.props.onSwipeRight(task),
          },
        ],
      }
    }

    return (
      <Swipeout
        buttonWidth={ width * 0.4 }
        autoClose={ true }
        style={ styles.item }
        backgroundColor="#fff"
        disabled={ !hasOnSwipeLeft && !hasOnSwipeRight }
        {  ...swipeOutProps }>
        <TouchableOpacity onPress={ () => this._onTaskClick(task) }>
          <Grid style={{ paddingVertical: 10 }}>
            <Col size={ 1 } style={ itemLeftStyle }>
              <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon type="FontAwesome" style={ iconStyle } name={ taskTypeIcon } />
              </Row>
              { isCompleted &&
              <Row style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              { this.renderTaskStatusIcon(task) }
              </Row>
              }
            </Col>
            <Col size={ 10 } style={ itemBodyStyle }>
              <Text style={ textStyle }>{this.props.t('TASK')} #{ task.id }</Text>
              { name ? (<Text style={ textStyle }>{ name }</Text>) : null }
              { task.address.name ? (<Text style={ textStyle }>{ task.address.name }</Text>) : null }
              <Text numberOfLines={ 1 } style={ textStyle }>{ task.address.streetAddress }</Text>
              <Text style={ textStyle }>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
            </Col>
            <Col size={ 1 } style={ styles.itemLeftRight }>
              <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
            </Col>
          </Grid>
        </TouchableOpacity>
      </Swipeout>
    )
  }

  render() {

    const { refreshing, onRefresh } = this.props

    return (
      <FlatList
        data={ this.props.tasks }
        keyExtractor={ (item, index) => item['@id'] }
        renderItem={({item}) => this.renderItem(item)}
        refreshing={ refreshing }
        onRefresh={ onRefresh }
      />
    )
  }
}

TaskList.defaultProps = {
  refreshing: false,
  onRefresh: () => {},
}

TaskList.propTypes = {
  onTaskClick: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
}

export default withTranslation(['common'], { withRef: true })(TaskList)
