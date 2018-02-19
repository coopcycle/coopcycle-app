import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container,
  Content, Button, Icon, List, ListItem, Text
} from 'native-base';

const AppUser = require('../../AppUser');

class AccountAddressesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      loading: false
    };
  }
  componentDidMount() {

    const { client } = this.props.navigation.state.params

    this.setState({ loading: true })

    client.get('/api/me')
      .then(user => {
        this.setState({
          loading: false,
          addresses: user.addresses
        })
      })
  }
  _renderRow(item) {
    return (
      <ListItem>
        <Text>{ item.streetAddress }</Text>
      </ListItem>
    );
  }
  render() {

    const { addresses } = this.state

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
          <List dataArray={ addresses } renderRow={ this._renderRow.bind(this) } />
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

module.exports = AccountAddressesPage;