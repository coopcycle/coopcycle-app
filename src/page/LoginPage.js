import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {
  Container, Header, Title, Content,
  List, ListItem,
  Form, Item, Input, InputGroup, Label,
  Left, Right, Body,
  Icon, Text, Picker, Button
} from 'native-base';

import { NavigationActions } from 'react-navigation'

import LoginForm from '../components/LoginForm'
import Settings from '../Settings'

class LoginPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      message: undefined,
    };
  }

  onLoginSuccess(user) {
    const { navigation } = this.props
    const { baseURL, client } = navigation.state.params

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          params: {
            baseURL,
            client,
            user
          }
        })
      ]
    })
    navigation.dispatch(resetAction)
  }

  onLoginFail(message) {
    this.setState({ message });
  }

  render() {

    const { client, baseURL } = this.props.navigation.state.params

    return (
      <Container>
        <Content style={{ paddingTop: 40 }}>
          <LoginForm
            client={ client }
            onLoginSuccess={ this.onLoginSuccess.bind(this) }
            onLoginFail={ this.onLoginFail.bind(this) } />
          <View style={{ marginTop: 30 }}>
            <Text style={{ textAlign: 'center' }}>Connecté à <Text style={{ fontWeight: 'bold' }}>{ baseURL }</Text></Text>
            <Button block transparent onPress={ () => Settings.removeServer() }>
              <Text>Choisir un autre serveur</Text>
            </Button>
          </View>
          <View style={styles.message}>
            <Text>{this.state.message}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    alignItems: "center",
    padding: 20,
  }
});

module.exports = LoginPage;