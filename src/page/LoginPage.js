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

  onLoginFormSubmit(email, password) {

    const { navigation } = this.props
    const { baseURL, client } = navigation.state.params

    client.login(email, password)
      .then((user) => {
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
      })
      .catch((err) => {
        console.log(err)
        if (err.hasOwnProperty('code') && err.code === 401) {
          this.setState({ message: "Utilisateur et/ou mot de passe inexistant." });
        } else {
          this.setState({ message: "Veuillez réessayer plus tard" });
        }
      });
  }

  render() {

    const { params } = this.props.navigation.state

    return (
      <Container>
        <Content style={{ paddingTop: 40 }}>
          <LoginForm onSubmit={ (email, password) => this.onLoginFormSubmit(email, password) } />
          <View style={{ marginTop: 30 }}>
            <Text style={{ textAlign: 'center' }}>Connecté à <Text style={{ fontWeight: 'bold' }}>{ params.baseURL }</Text></Text>
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