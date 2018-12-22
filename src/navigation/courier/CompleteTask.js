import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Container, Content,
  Icon, Text, Button, Footer,
  Form, Item, Input, Label
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { selectTasksList, selectIsTaskCompleteFailure, markTaskDone, markTaskFailed } from '../../redux/Courier'
import { greenColor, greyColor, redColor } from '../../styles/common'

class CompleteTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notes: ''
    }
  }

  markTaskDone() {

    const { task } = this.props.navigation.state.params
    const { markTaskDone } = this.props
    const { notes } = this.state

    markTaskDone(this.props.httpClient, task, notes)
  }

  markTaskFailed() {

    const { task } = this.props.navigation.state.params
    const { markTaskFailed } = this.props
    const { notes } = this.state

    markTaskFailed(this.props.httpClient, task, notes)
  }

  render() {

    const { task, markTaskDone, markTaskFailed } = this.props.navigation.state.params

    const buttonIconName = markTaskDone ? 'checkmark' : 'warning'
    const onPress = markTaskDone ? this.markTaskDone.bind(this) : this.markTaskFailed.bind(this)

    return (
      <Container>
        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label>{ this.props.t('NOTES') }</Label>
              <Input onChangeText={ text => this.setState({ notes: text }) } />
            </Item>
          </Form>
        </Content>
        <Footer style={{ alignItems: 'center', backgroundColor: markTaskDone ? greenColor : redColor }}>
          <TouchableOpacity style={ styles.buttonContainer } onPress={ onPress }>
            <View style={ styles.buttonTextContainer }>
              <Icon name={ buttonIconName } style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{ markTaskDone ? this.props.t('VALIDATE') : this.props.t('MARK_FAILED') }</Text>
            </View>
          </TouchableOpacity>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    ...StyleSheet.absoluteFillObject
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
})

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    tasks: selectTasksList(state),
    taskCompleteError: selectIsTaskCompleteFailure(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    markTaskFailed: (client, task, notes) => dispatch(markTaskFailed(client, task, notes)),
    markTaskDone: (client, task, notes) => dispatch(markTaskDone(client, task, notes)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(CompleteTask))
