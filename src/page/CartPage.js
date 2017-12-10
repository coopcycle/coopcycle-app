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
import LoginForm from '../components/LoginForm';

const AppUser = require('../AppUser');

class CartPage extends Component {
  constructor(props) {
    super(props);

    const { cart } = this.props.navigation.state.params

    this.state = {
      cart: cart,
      loading: false,
      loginModalVisible: false,
      modalVisible: false,
      editing: null,
    };
  }
  _renderRow(item) {
    return (
      <ListItem key={ item.key } onPress={() => this.setState({ editing: item, modalVisible: true })}>
        <Body>
          <Text>{ item.name }</Text>
          <Text note>{ item.price } € x { item.quantity }</Text>
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
          this.setState({ loginModalVisible: true })
        }
      });
  }

  onLoginSuccess(user) {
    const { navigate } = this.props.navigation
    const { client, deliveryAddress } = this.props.navigation.state.params
    const { cart } = this.state

    this.setState({ loginModalVisible: false })
    navigate('CartAddress', { cart, deliveryAddress, client, user })
  }

  onLoginFail(message) {
    console.log('onLoginFail', message)
  }

  decrement() {
    if (this.state.editing.quantity > 0) {
      this.state.editing.decrement()

      const cart = this.state.editing.cart.clone()

      const { onCartUpdate } = this.props.navigation.state.params
      onCartUpdate(cart)

      if (this.state.editing.quantity === 0) {
        this.setState({
          cart: cart,
          editing: null,
          modalVisible: false,
        })
      } else {
        this.setState({ cart })
      }
    }
  }

  increment() {
    this.state.editing.increment()

    const cart = this.state.editing.cart.clone()

    const { onCartUpdate } = this.props.navigation.state.params
    onCartUpdate(cart)

    this.setState({ cart })
  }

  renderModal() {
    return (
      <Modal
        animationType={ 'slide' }
        transparent={ true }
        visible={ this.state.modalVisible }
        onRequestClose={() => this.setState({ modalVisible: false })}>
        <View style={ styles.modalWrapper }>
          <Container>
            <Content theme={theme}>
              <Grid>
                <Row style={{ paddingVertical: 30 }}>
                  <Col>
                    <Text style={{ textAlign: 'center' }}>{ this.state.editing ? this.state.editing.menuItem.name : '' }</Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={ styles.modalDecrement }>
                      <Button bordered rounded onPress={ () => this.decrement() }>
                        <Icon name="remove" />
                      </Button>
                    </View>
                  </Col>
                  <Col>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text>{ this.state.editing ? this.state.editing.quantity : '0' }</Text>
                    </View>
                  </Col>
                  <Col>
                    <View style={ styles.modalIncrement }>
                      <Button bordered rounded onPress={ () => this.increment() }>
                        <Icon name="add" />
                      </Button>
                    </View>
                  </Col>
                </Row>
                <Row style={{ paddingVertical: 30 }}>
                  <Col>
                    <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                      <Button bordered block onPress={() => this.setState({ editing: null, modalVisible: false })}>
                        <Text>Valider</Text>
                      </Button>
                    </View>
                  </Col>
                </Row>
              </Grid>
            </Content>
          </Container>
        </View>
      </Modal>
    );
  }

  renderLoginModal() {
    const { client } = this.props.navigation.state.params

    return (
      <Modal
        animationType={ 'slide' }
        transparent={ true }
        visible={ this.state.loginModalVisible }
        onRequestClose={() => this.setState({ loginModalVisible: false })}>
        <View style={ styles.modalWrapper }>
          <Container>
            <Content theme={theme}>
              <LoginForm
                client={ client }
                onLoginSuccess={ this.onLoginSuccess.bind(this) }
                onLoginFail={ this.onLoginFail.bind(this) } />
            </Content>
          </Container>
        </View>
      </Modal>
    )
  }

  render() {

    return (
      <Container>
        <Content theme={theme}>
          { this.renderModal() }
          { this.renderLoginModal() }
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
    marginTop: 56,
    backgroundColor: '#fff'
  },
  modalDecrement: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  modalIncrement: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  }
});

module.exports = CartPage;