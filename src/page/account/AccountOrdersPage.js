import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, Button, Icon, List, ListItem, Text
} from 'native-base';
import _ from 'underscore';

import theme from '../../theme/coopcycle';

class AccountOrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orders: []
    };
  }
  componentDidMount() {
    this.props.client.get('/api/me/orders')
      .then((data) => {
        this.setState({
          loading: false,
          orders: data['hydra:member']
        })
      });
  }
  _renderRow(navigator, order) {
    return (
      <ListItem onPress={() => navigator.parentNavigator.push({
        id: 'OrderTrackingPage',
        name: 'OrderTracking',
        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
        passProps: {
          order: order
        }
      })}>
        <Body><Text>{ order.restaurant.name }</Text></Body>
        <Right><Text>{ order.total } €</Text></Right>
      </ListItem>
    );
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
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
      <Container theme={ theme }>
        <Header>
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Commandes</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List dataArray={ this.state.orders } renderRow={ this._renderRow.bind(this, navigator) } />
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

module.exports = AccountOrdersPage;