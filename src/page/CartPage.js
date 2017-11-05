import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
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
import theme from '../theme/coopcycle';
import _ from 'underscore';

const AppUser = require('../AppUser');

class CartPage extends Component {
  constructor(props) {
    super(props);

    const cart = props.cart;
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
            let cart = this.state.cart;
            cart.deleteItem(item);
            this.props.onCartUpdate(cart);
            this.setState({
              cart: cart,
            });
          }}>
            <Icon name="trash" />
          </Button>
        </Right>
      </ListItem>
    )
  }
  _gotoNextPage(navigator) {
    navigator.parentNavigator.push({
      id: 'CartAddressPage',
      name: 'CartAddress',
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
      passProps: {
        cart: this.state.cart
      }
    });
  }
  _onClickButton(navigator) {
    AppUser.load()
      .then((user) => {
        if (user.hasCredentials()) {
          this._gotoNextPage(navigator);
        } else {
          navigator.parentNavigator.push({
            id: 'LoginPage',
            name: 'Login',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            passProps: {
              onLoginSuccess: () => {
                this._gotoNextPage(navigator);
              }
            }
          });
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
  renderModal() {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}>
        <View style={ styles.modalWrapper }>
          <Text style={{ textAlign: 'center' }}>{ this.state.editing ? this.state.editing.menuItem.name : '' }</Text>
          <Grid>
            <Row>
              <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Button bordered rounded onPress={() => {
                    if (this.state.editing.quantity > 0) {
                      this.state.editing.decrement();

                      const cart = this.state.editing.cart.clone();
                      this.props.onCartUpdate(cart);

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
                    this.props.onCartUpdate(cart);
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
  renderScene(route, navigator) {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Panier</Title>
          </Body>
          <Right />
        </Header>
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
              <Button success block style={ { alignSelf: 'flex-end' } } onPress={ this._onClickButton.bind(this, navigator) }>
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