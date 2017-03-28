import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
} from 'react-native';
import {
  Container, Header, Title, Content, Footer,
  Left, Right, Body,
  List, ListItem,
  InputGroup, Input,
  Icon, Text, Picker, Button
} from 'native-base';
import theme from '../theme/coopcycle';
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
          <Text style={{ flex: 3 }}>{recipe.name}</Text>
          <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{recipe.price} €</Text>
        </View>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{ this.props.restaurant.name }</Title>
          </Body>
          <Right />
        </Header>
        <Content theme={theme}>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections
            renderRow={this._renderRow.bind(this)}
            />
        </Content>
        <Footer>
          <View style={styles.cart}>
            <View style={styles.cartLeft}>
              <Text>{this.state.cart.articlesCount} articles</Text>
              <Text style={ { fontWeight: 'bold' } }>{this.state.cart.total} €</Text>
            </View>
            <View style={styles.cartRight}>
              <Button block style={ { alignSelf: 'flex-end' } } onPress={() => navigator.parentNavigator.push({
                  id: 'CartPage',
                  name: 'Cart',
                  sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                  passProps: {
                    cart: this.state.cart,
                    onCartUpdate: (cart) => {
                      this.setState({cart});
                    }
                  }
                })}>
                <Text>Commander</Text>
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
    flex: 2,
  },
  listView: {
    flex: 4,
    borderTopColor: "black",
    borderStyle: "solid",
    borderTopWidth: 2
  },
  listViewItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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
});

module.exports = RestaurantPage;