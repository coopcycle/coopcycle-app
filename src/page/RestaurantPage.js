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
} from 'react-native';

import _ from 'underscore';

const Cart = require('../Cart');

class RestaurantPage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      modalVisible: false,
      distance: 2000,
      loading: false,
      dataSource: ds.cloneWithRows(this.props.restaurant.products),
      cart: new Cart(props.restaurant)
    };
  }
  _addToCart(recipe) {
    const cart = this.state.cart;
    cart.addOffer(recipe);
    this.setState({cart});
  }
  _renderRow(recipe) {
    return (
      <TouchableHighlight
        style={styles.recipe}
        onPress={() => this._addToCart(recipe)}>
        <View style={styles.listViewItem}>
          <Text>{recipe.name}</Text>
        </View>
      </TouchableHighlight>
    );
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
    return (
      <View style={styles.container}>
        <View style={styles.products}>
          <View style={styles.heading}>
            <Text style={{color: "white", fontWeight: 'bold'}}>{this.props.restaurant.name}</Text>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections
            renderRow={this._renderRow.bind(this)}
            />
        </View>
        <View style={styles.separator}>
        </View>
        <View style={styles.cart}>
          <View style={styles.cartLeft}>
            <Text style={[]}>{this.state.cart.articlesCount} articles</Text>
            <Text style={[]}>{this.state.cart.total} €</Text>
          </View>
          <View style={styles.cartRight}>
            <TouchableOpacity style={styles.button}
              onPress={() => navigator.parentNavigator.push({
                id: 'CartPage',
                name: 'Cart',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                passProps: {
                  cart: this.state.cart,
                  onCartUpdate: (cart) => {
                    this.setState({cart});
                  }
                }
              })}>
              <Text style={[styles.textBold, styles.textWhite, styles.textCenter]}>Mon panier</Text>
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
    // return (
    //   <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
    //     <Text style={{color: 'white', margin: 10, fontSize: 16}}>
    //       Panier
    //     </Text>
    //   </TouchableOpacity>
    // );
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Restaurant
        </Text>
      </TouchableOpacity>
    );
  }
};

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
    backgroundColor: "#f4f4f2"
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
    backgroundColor: "#3498db",
  },
  buttonText: {

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
  listView: {
    flex: 4,
    borderTopColor: "black",
    borderStyle: "solid",
    borderTopWidth: 2
  },
  listViewItem: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  recipe: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e4e4e4",
    borderRadius: 4,
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
    backgroundColor: '#8E8E8E',
  },
});

module.exports = RestaurantPage;