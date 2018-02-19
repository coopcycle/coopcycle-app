import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, Button, Icon, List, ListItem, Text
} from 'native-base';


class AccountOrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orders: []
    };
  }
  componentDidMount() {

    const { client } = this.props.navigation.state.params

    client.get('/api/me/orders')
      .then((data) => {
        this.setState({
          loading: false,
          orders: data['hydra:member']
        })
      });
  }
  _renderRow(order) {

    const { navigate } = this.props.navigation
    const { client } = this.props.navigation.state.params

    return (
      <ListItem onPress={() => navigate('OrderTracking', { client, order }) }>
        <Body><Text>{ order.restaurant.name }</Text></Body>
        <Right><Text>{ order.total } €</Text></Right>
      </ListItem>
    );
  }
  render() {
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
      <Container>
        <Content>
          <List dataArray={ this.state.orders } renderRow={ this._renderRow.bind(this) } />
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