import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Content, Text, Icon, List, ListItem, Left, Body, Right } from 'native-base'
import { Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import Avatar from '../../components/Avatar'

class AddUser extends Component {

  _onItemPress(user) {
    this.props.navigation.goBack()
    this.props.onUserPicked(user)
  }

  renderListItem(user) {

    return (
      <ListItem avatar
        onPress={ () => this._onItemPress(user) }
        key={ user.username }
        testID={ `assignTo:${user.username}` }>
        <Grid>
          <Left>
            <Avatar baseURL={ this.props.baseURL } username={ user.username } />
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


export default connect(mapStateToProps)(withTranslation()(AddUser))
