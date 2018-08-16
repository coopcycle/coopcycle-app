import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  ListItem, Icon, Text, Button, Radio
} from 'native-base'

import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { changeStatus } from '../../redux/Restaurant/actions'

class StatusScreen extends Component {

  changeStatus(status) {
    this.props.changeStatus(status)
    setTimeout(() => this.props.navigation.goBack(), 250)
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={ () => this.props.navigation.goBack() }>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Change status</Title>
          </Body>
          <Right />
        </Header>
        <Content style={ styles.content }>
          <ListItem onPress={ () => this.changeStatus('available') }>
            <Left>
              <Body>
                <Text>Available</Text>
                <Text note>You are available to receive orders</Text>
              </Body>
            </Left>
            <Right>
              <Radio selected={ this.props.status === 'available' } />
            </Right>
          </ListItem>
          <ListItem onPress={ () => this.changeStatus('rush') }>
            <Left>
              <Body>
                <Text>Rush</Text>
                <Text note>You are available to receive orders, but cooking times are increased</Text>
              </Body>
            </Left>
            <Right>
              <Radio selected={ this.props.status === 'rush' } />
            </Right>
          </ListItem>
          <ListItem onPress={ () => this.changeStatus('disabled') }>
            <Left>
              <Body>
                <Text>Disabled</Text>
                <Text note>Customer will not be able to place orders</Text>
              </Body>
            </Left>
            <Right>
              <Radio selected={ this.props.status === 'disabled' } />
            </Right>
          </ListItem>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
  }
})

function mapStateToProps(state) {
  return {
    status: state.restaurant.status
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: status => dispatch(changeStatus(status)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(StatusScreen))
