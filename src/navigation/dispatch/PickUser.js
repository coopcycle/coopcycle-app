import React, { Component } from 'react'
import { FlatList, InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Text, Icon, Thumbnail, List, ListItem, Left, Body, Right } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import _ from 'lodash'

import { loadUsers } from '../../redux/Dispatch/actions'

class AddUser extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadUsers()
    })
  }

  _onItemPress(user) {
    this.props.navigation.goBack()
    this.props.onUserPicked(user)
  }

  renderListItem(user) {

    const avatarURI = `${this.props.baseURL}/images/avatars/${user.username}.png`

    return (
      <ListItem avatar
        onPress={ () => this._onItemPress(user) }
        key={ user.username }>
        <Grid>
          <Left>
            <Thumbnail small source={{ uri: avatarURI }} />
          </Left>
          <Body>
            <Text>{ user.username }</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </Grid>
      </ListItem>
    )
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Content>
          <List>
            { this.props.users.map(user => this.renderListItem(user)) }
          </List>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const users = _.filter(state.dispatch.users, user => _.includes(user.roles, 'ROLE_COURIER'))

  const { onUserPicked } = ownProps.navigation.state.params

  return {
    baseURL: state.app.baseURL,
    users: users,
    onUserPicked: onUserPicked,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUsers: () => dispatch(loadUsers()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddUser))
