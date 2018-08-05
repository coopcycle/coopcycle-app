import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base';
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { formatPrice } from '../../Cart'
import LoaderOverlay from '../../components/LoaderOverlay'
import OrderSummary from '../../components/OrderSummary'
import { acceptOrder } from '../../redux/Restaurant/actions'

class OrderScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  renderButtons() {

    const { order } = this.props.navigation.state.params

    if (order.state === 'new') {
      return (
        <Button success block
          onPress={() => this.props.acceptOrder(this.props.httpClient, order)}>
          <Text>Confirmer la commande</Text>
        </Button>
      )
    }
  }

  render() {

    const { navigate } = this.props.navigation

    const { order } = this.props.navigation.state.params

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Détails de la commande</Title>
          </Body>
          <Right />
        </Header>
        <Content style={ styles.content }>
          <OrderSummary order={ order } />
          { this.renderButtons() }
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 15
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

function mapStateToProps(state) {
  return {
    user: state.app.user,
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching
  }
}

function mapDispatchToProps(dispatch) {
  return {
    acceptOrder: (client, order) => dispatch(acceptOrder(client, order)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(OrderScreen))
