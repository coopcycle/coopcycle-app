import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base';
import theme from '../theme/coopcycle';

const Auth = require('../Auth');

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null
    };
  }

  componentDidMount() {

    const { client } = this.props.navigation.state.params

    this.setState({ loading: true })

    client.request('GET', '/api/me')
      .then((user) => {
        this.setState({
          loading: false,
          user: user
        })
      })
      .catch((err) => {
        if (err === 'Invalid refresh token') {
          this._logout();
        }
      });
  }

  render() {

    const { navigate } = this.props.navigation
    const { user } = this.state
    const { client } = this.props.navigation.state.params

    let loader = (
      <View />
    )
    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>Chargement...</Text>
        </View>
      );
    }

    return (
      <Container theme={ theme }>
        <Content>
          <List>
            <ListItem button>
              <Body>
                <Text>Coordonnées personnelles</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountAddresses', { addresses: user.addresses }) }>
              <Body>
                <Text>Adresses</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountOrders', { client }) }>
              <Body>
                <Text>Commandes</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
        { loader }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
});

module.exports = AccountPage;