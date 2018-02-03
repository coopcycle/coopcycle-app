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
            <ListItem button iconRight onPress={() => {
              navigate('CourierTasks', { baseURL, client, user })
            }}>
              <Body>
                <Text>Mes tâches</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight>
              <Body>
                <Text>Mes statistiques</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
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