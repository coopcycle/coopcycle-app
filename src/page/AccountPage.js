import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import theme from '../theme/coopcycle';

const Auth = require('../Auth');

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.client.request('GET', '/api/me')
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
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator} />
    );
  }
  _logout() {
    Auth.removeUser().then(() => {
      this.props.onLogout();
    });
  }
  renderScene(route, navigator) {
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
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name='ios-close' />
          </Button>
          <Title>Mon compte</Title>
          <Button transparent
            style={{ alignSelf: 'flex-end', marginVertical: 20 }}
            onPress={ this._logout.bind(this) }>
            <Icon name="ios-exit" />
          </Button>
        </Header>
        <Content padder>
          <List>
            <ListItem button iconRight>
              <Text>Coordonnées personnelles</Text>
              <Icon name="ios-arrow-forward" />
            </ListItem>
            <ListItem button iconRight onPress={() => navigator.parentNavigator.push({
              id: 'AccountAddressesPage',
              name: 'AccountAddresses',
              sceneConfig: Navigator.SceneConfigs.FloatFromRight,
              passProps: {
                user: this.state.user
              }
            })}>
              <Text>Adresses</Text>
              <Icon name="ios-arrow-forward" />
            </ListItem>
            <ListItem button iconRight onPress={() => navigator.parentNavigator.push({
              id: 'AccountOrdersPage',
              name: 'AccountOrders',
              sceneConfig: Navigator.SceneConfigs.FloatFromRight,
              passProps: {
                user: this.state.user
              }
            })}>
              <Text>Commandes</Text>
              <Icon name="ios-arrow-forward" />
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