import React, { Component } from 'react'
import { FlatList, InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Text } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import _ from 'lodash'
import moment from 'moment'

import { createTaskList, loadUsers } from '../../redux/Dispatch/actions'

class AddUser extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadUsers()
    })
  }

  renderItem(user) {

    return (
      <TouchableOpacity
        onPress={ () => this.props.createTaskList(moment(), user) }
        style={ styles.item }>
        <Grid>
          <Col>
            <Text>{ user.username }</Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Content padder>
          <FlatList
            data={ this.props.users }
            keyExtractor={ (item, index) => item.username }
            renderItem={ ({ item }) => this.renderItem(item) } />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
})

function mapStateToProps(state) {

  const users = _.filter(state.dispatch.users, user => _.includes(user.roles, 'ROLE_COURIER'))

  return {
    users: users,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTaskList: (date, user) => dispatch(createTaskList(date, user)),
    loadUsers: () => dispatch(loadUsers()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddUser))
