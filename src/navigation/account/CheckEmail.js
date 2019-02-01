import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Container,
  Header,
  Left, Right,
  Text,
  Title, Content, Button, Icon,
} from 'native-base'
import { translate } from 'react-i18next'

class CheckEmail extends Component {

  render() {

    // const { order } = this.props.navigation.state.params

    console.log('params', this.props.navigation.state.params)

    return (
      <Container>
        <Content padder>
          <Text>
            CHECK EMAIL
          </Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

})

module.exports = translate()(CheckEmail)
