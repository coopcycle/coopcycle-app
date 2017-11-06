import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import {
  Container,
  Header, Title, Content, Footer,
  Left, Right, Body,
  List, ListItem,
  InputGroup, Input,
  Icon, Picker, Button, Text,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation'

import theme from '../theme/coopcycle';

const AppUser = require('../AppUser');

class CartPage extends Component {
  constructor(props) {
    super(props);

    const { cart } = this.props.navigation.state.params

    this.state = {
      cart: cart,
      loading: false,
      modalVisible: false,
      editing: null,
    };
  }
  _renderRow(item) {
    return (
      <ListItem key={ item.key } onPress={() => this.setState({ editing: item, modalVisible: true })}>
        <Body>
          <Text>{item.menuItem.name}</Text>
          <Text note>{item.menuItem.price} € x {item.quantity}</Text>
        </Body>
        <Right>
          <Button danger transparent onPress={() => {

            const { cart } = this.state
            const { onCartUpdate } = this.props.navigation.state.params

            cart.deleteItem(item)

            onCartUpdate(cart)
            this.setState({ cart })

          }}>
            <Icon name="trash" />
          </Button>
        </Right>
      </ListItem>
    )
  }
  _onClickButton() {

    const { navigate } = this.props.navigation
    const { client, deliveryAddress, user } = this.props.navigation.state.params
    const { cart } = this.state

    AppUser.load()
      .then((user) => {
        if (user.hasCredentials()) {
          navigate('CartAddress', { cart, deliveryAddress, client, user })
        } else {
          // TODO navigate to login
        }
      });
  }

  renderModal() {
    return (
      <Modal
        animationType={ 'slide' }
        transparent={ true }
        visible={ this.state.modalVisible }>
        <View style={ styles.modalWrapper }>
          <Text style={{ textAlign: 'center' }}>{ this.state.editing ? this.state.editing.menuItem.name : '' }</Text>
          <Grid>
            <Row>
              <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Button bordered rounded onPress={() => {
                    if (this.state.editing.quantity > 0) {
                      this.state.editing.decrement();

                      const cart = this.state.editing.cart.clone();

                      const { onCartUpdate } = this.props.navigation.state.params
                      onCartUpdate(cart)

                      if (this.state.editing.quantity === 0) {
                        this.setState({
                          cart: cart,
                          editing: null,
                          modalVisible: false,
                        });
                      } else {
                        this.setState({ cart });
                      }
                    }
                  }}>
                  <Icon name="remove" />
                </Button>
              </Col>
              <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>{ this.state.editing ? this.state.editing.quantity : '0' }</Text>
              </Col>
              <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Button bordered rounded onPress={() => {
                    this.state.editing.increment();

                    const cart = this.state.editing.cart.clone();

                    const { onCartUpdate } = this.props.navigation.state.params
                    onCartUpdate(cart)

                    this.setState({
                      cart: cart,
                    });
                  }}>
                  <Icon name="add" />
                </Button>
              </Col>
            </Row>
          </Grid>
          <Button bordered block onPress={() => this.setState({ editing: null, modalVisible: false })}>
            <Text>Valider</Text>
          </Button>
        </View>
      </Modal>
    );
  }

  render() {

    return (
      <Container>
        <Content theme={theme}>
          { this.renderModal() }
          <List>{ this.state.cart.items.map(this._renderRow.bind(this)) }</List>
        </Content>
        <Footer>
          <View style={styles.cart}>
            <View style={styles.cartLeft}>
              <Text>{this.state.cart.articlesCount} articles</Text>
              <Text style={ { fontWeight: 'bold' } }>{this.state.cart.total} €</Text>
            </View>
            <View style={styles.cartRight}>
              <Button success block style={ { alignSelf: 'flex-end' } } onPress={ this._onClickButton.bind(this) }>
                <Text>Payer { this.state.cart.total } €</Text>
              </Button>
            </View>
          </View>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cart: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  cartLeft: {
    flex: 1,
  },
  cartRight: {
    flex: 1,
  },
  textBold: {
    fontWeight: 'bold'
  },
  textWhite: {
    color: "white",
  },
  textCenter: {
    textAlign: 'center'
  },
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 64,
    padding: 20,
    backgroundColor: "#fff"
  }
});

module.exports = CartPage;