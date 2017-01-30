import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header, Title, Content, Footer, FooterTab,
  List, ListItem,
  InputGroup, Input,
  Icon, Picker, Button,
} from 'native-base';
import theme from '../theme/coopcycle';
import _ from 'underscore';

const AppUser = require('../AppUser');
const Cart = require('../Cart');

class CartPage extends Component {
  constructor(props) {
    super(props);
    const cart = props.cart;
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      return r1 !== r2 && r1.quantity !== r2.quantity;
    }});
    this.state = {
      cart: cart,
      loading: false,
    };
  }
  _renderRow(item) {
    return (
      <ListItem>
        <View style={styles.cartRow}>
          <View style={styles.cartRowLeft}>
            <Text>{item.offer.name}</Text>
          </View>
          <View style={styles.cartRowQuantity}>
            <Button transparent onPress={() => {
                item.decrement();
                this.props.onCartUpdate(item.cart);
                this.setState({
                  cart: item.cart,
                });
              }}>
              <Icon name="ios-remove" />
            </Button>
            <Text style={styles.cartQuantityText}>{item.quantity}</Text>
            <Button transparent onPress={() => {
                item.increment();
                this.props.onCartUpdate(item.cart);
                this.setState({
                  cart: item.cart,
                });
              }}>
              <Icon name="ios-add" />
            </Button>
          </View>
          <View style={styles.cartRowRight}>
            <Button bordered rounded danger style={ { alignSelf: "flex-end" } } onPress={() => {
                let cart = this.state.cart;
                cart.deleteItem(item);
                this.props.onCartUpdate(cart);
                this.setState({cart});
              }}>
              <Icon name="ios-close-outline" />
            </Button>
          </View>
        </View>
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
  renderScene(route, navigator) {
    let dataSource = this.dataSource.cloneWithRows(this.state.cart.items)
    return (
      <Container>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>Panier</Title>
        </Header>
        <Content theme={theme}>
          <List dataArray={ this.state.cart.items } renderRow={ this._renderRow.bind(this) } />
        </Content>
        <Footer>
          <View style={styles.cart}>
            <View style={styles.cartLeft}>
              <Text>{this.state.cart.articlesCount} articles</Text>
              <Text style={ { fontWeight: 'bold' } }>{this.state.cart.total} €</Text>
            </View>
            <View style={styles.cartRight}>
              <Button success block style={ { alignSelf: 'flex-end' } } onPress={ this._onClickButton.bind(this, navigator) }>
                Payer { this.state.cart.total } €
              </Button>
            </View>
          </View>
        </Footer>
      </Container>
    );
  }
}

const carButtonSize = 36;

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
  cartRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartRowLeft: {
    flex: 2,
    paddingRight: 5
  },
  cartRowQuantity: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
  },
  cartRowRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cartQuantityText: {
    paddingHorizontal: 10,
  },
  cartQuantityButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8e8e8e',
    // backgroundColor: '#f4f4f2',
    width: carButtonSize,
    height: carButtonSize,
    borderRadius: carButtonSize / 2,
  },
  cartQuantityButtonText: {
    color: '#8e8e8e',
    padding: 0,
    margin: 0,
  },
  listView: {
    flex: 4,
    borderTopColor: "black",
    borderStyle: "solid",
    borderTopWidth: 2
  },
});

module.exports = CartPage;