import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container,
  Content, Button, Icon, List, ListItem, Text
} from 'native-base';
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

class AccountAddressesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      loading: false
    };
  }
  componentDidMount() {

    this.setState({ loading: true })

    this.props.httpClient.get('/api/me')
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
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
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

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient
  }
}

module.exports = connect(mapStateToProps)(withNamespaces('common')(AccountAddressesPage))
