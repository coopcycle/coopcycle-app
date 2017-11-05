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
    this.state = {
      modalVisible: false,
      distance: 2000,
      loading: false,
      cart: new Cart(props.restaurant)
    };
  }
  _addToCart(menuItem) {
    const { cart } = this.state
    cart.addMenuItem(menuItem)

    this.setState({ cart })
  }
  _renderMenuItem(menuItem) {
    const isDivider = menuItem['@type'] === 'http://schema.org/MenuSection'
    const props = isDivider ? { itemDivider: true } : {
      button: true,
      onPress: () => this._addToCart(menuItem)
    }

    return (
      <ListItem key={ menuItem['@id'] } { ...props}>
        <Body>
          <Text>{ menuItem.name }</Text>
        </Body>
        { !isDivider && <Right>
          <Text>{ menuItem.offers.price } €</Text>
        </Right> }
      </ListItem>
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
    let items = []
    _.forEach(this.props.restaurant.hasMenu.hasMenuSection, menuSection => {
      items.push(menuSection)
      _.forEach(menuSection.hasMenuItem, menuItem => {
        items.push(menuItem)
      })
    })

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
          <List>
          { _.map(items, item => this._renderMenuItem(item)) }
          </List>
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