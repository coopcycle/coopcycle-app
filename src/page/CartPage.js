import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  ActivityIndicator,
} from 'react-native';
import _ from 'underscore';

const Cart = require('../Cart');
const GeoUtils = require('../GeoUtils');
const OrdersAPI = require('../OrdersAPI');
const Auth = require('../Auth');

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
      <View style={styles.cartRow}>
        <View style={styles.cartRowLeft}>
          <Text>{item.offer.name}</Text>
        </View>
        <View style={styles.cartRowQuantity}>
          <TouchableHighlight style={styles.cartQuantityButton}
            onPress={() => {
              item.decrement();
              this.props.onCartUpdate(item.cart);
              this.setState({
                cart: item.cart,
              });
            }}>
            <Text style={styles.cartQuantityButtonText}>-</Text>
          </TouchableHighlight>
          <Text style={styles.cartQuantityText}>{item.quantity}</Text>
          <TouchableHighlight style={styles.cartQuantityButton}
            onPress={() => {
              item.increment();
              this.props.onCartUpdate(item.cart);
              this.setState({
                cart: item.cart,
              });
            }}>
            <Text style={styles.cartQuantityButtonText}>+</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.cartRowRight}>
          <TouchableHighlight style={styles.deleteButton}
            onPress={() => {
              let cart = this.state.cart;
              cart.deleteItem(item);
              this.props.onCartUpdate(cart);
              this.setState({cart});
            }}>
            <Text style={{color: '#e74c3c'}}>Supprimer</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  _createOrder() {
    this.setState({loading: true});
    OrdersAPI.createOrder(this.state.cart).then((data) => {
      console.log(data);
      this.setState({loading: false});
    });
  }
  _onClickButton(navigator) {
    Auth.getUser()
      .then((user) => {
        this._createOrder();
      })
      .catch((error) => {
        navigator.parentNavigator.push({
          id: 'LoginPage',
          name: 'Login',
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          passProps: {
            onLoginSuccess: () => {
              this._createOrder();
            }
          }
        });
      });
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    let dataSource = this.dataSource.cloneWithRows(this.state.cart.items)
    return (
      <View style={styles.container}>
        <View style={styles.products}>
          <View style={styles.loader}>
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color="#0000ff"
            />
          </View>
          <ListView
            dataSource={dataSource}
            enableEmptySections
            renderRow={this._renderRow.bind(this)}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
        </View>
        <View style={styles.separator} />
        <View style={styles.cart}>
          <View style={styles.cartLeft}>
            <Text style={[]}>{this.state.cart.articlesCount} articles</Text>
            <Text style={[]}>{this.state.cart.total} €</Text>
          </View>
          <View style={styles.cartRight}>
            <TouchableOpacity style={styles.button}
              onPress={this._onClickButton.bind(this, navigator)}>
              <Text style={[styles.textBold, styles.textWhite, styles.textCenter]}>Payer {this.state.cart.total} €</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>Retour</Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Panier
        </Text>
      </TouchableOpacity>
    );
  }
};

const carButtonSize = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    // backgroundColor: '#F5FCFF',
    paddingTop: 60,
  },
  heading: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#16a085",
  },
  products: {
    flex: 8,
  },
  cart: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
  },
  cartLeft: {
    flex: 1,
    padding: 10,
  },
  cartRight: {
    flex: 2,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 4,
    padding: 5,
    margin: 10,
    backgroundColor: "#2ecc71",
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
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  cartRowLeft: {
    flex: 1,
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
    paddingHorizontal: 20,
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
  header: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8e8e8e',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});

module.exports = CartPage;