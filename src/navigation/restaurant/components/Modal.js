import React, { Component } from 'react'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Icon, Text, Button
} from 'native-base'

class Modal extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>{ this.props.title }</Title>
          </Body>
          <Right />
        </Header>
        { this.props.children }
      </Container>
    )
  }
}

export default Modal
