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
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { formatPrice } from '../../Cart'

class AccountOrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orders: []
    };
  }
  componentDidMount() {
    this.props.httpClient.get('/api/me/orders')
      .then((data) => {
        this.setState({
          loading: false,
          orders: data['hydra:member']
        })
      });
  }
  _renderRow(order) {

    const { navigate } = this.props.navigation

    return (
      <ListItem onPress={() => navigate('OrderTracking', { order }) }>
        <Body><Text>{ order.restaurant.name }</Text></Body>
        <Right><Text>{ formatPrice(order.total) } €</Text></Right>
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
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
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

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient
  }
}

module.exports = connect(mapStateToProps)(translate()(AccountOrdersPage))
