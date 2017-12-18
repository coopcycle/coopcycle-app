import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base';

import { NavigationActions } from 'react-navigation'

import LoginForm from '../components/LoginForm'
import Settings from '../Settings'

class CourierPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: ''
    };
  }

  logout() {

    const { baseURL, client, user, navigation } = this.props.screenProps

    user.logout()
      .then(() => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
              params: {
                baseURL,
                client,
                user: null
              }
            })
          ]
        })
        navigation.dispatch(resetAction)
      })
  }

  render() {

    const { baseURL, client, user } = this.props.navigation.state.params
    const { navigate } = this.props.navigation

    return (
      <Container>
        <Content style={ styles.content }>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Icon name="ios-bicycle" />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
              Bonjour { user.username }
            </Text>
          </View>
          <List>
            <ListItem button iconRight>
              <Body>
                <Text>Mes statistiques</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight>
              <Body>
                <Text>Mes courses</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('Dispatch', { baseURL, client, user, connected: false, tracking: false }) }>
              <Body>
                <Text>Dispatch automatique</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <View style={{ paddingHorizontal: 10, marginTop: 40 }}>
            <Button block danger onPress={ () => this.logout() }>
              <Text>Déconnexion</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 30
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  message: {
    alignItems: "center",
    padding: 20
  }
});

module.exports = CourierPage;