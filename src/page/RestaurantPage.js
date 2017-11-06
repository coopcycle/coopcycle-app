import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
} from 'react-native';
import {
  Container, Header, Title, Content, Footer, H3, H4,
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

    const { restaurant } = this.props.navigation.state.params

    this.state = {
      modalVisible: false,
      distance: 2000,
      loading: false,
      cart: new Cart(restaurant, [])
    };
  }

  componentDidMount() {
    console.log('componentDidMount')
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

    const { navigate } = this.props.navigation
    const { restaurant, deliveryAddress, client, user } = this.props.navigation.state.params
    const { cart } = this.state

    let items = []
    _.forEach(restaurant.hasMenu.hasMenuSection, menuSection => {
      items.push(menuSection)
      _.forEach(menuSection.hasMenuItem, menuItem => {
        items.push(menuItem)
      })
    })

    return (
      <Container>
        <Content theme={theme}>
          <H3 style={{ textAlign: 'center', marginVertical: 10 }}>{ restaurant.name }</H3>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>Livraison : { deliveryAddress.streetAddress }</Text>
          <List>
          { _.map(items, item => this._renderMenuItem(item)) }
          </List>
        </Content>
        <Footer>
          <View style={styles.cart}>
            <View style={styles.cartLeft}>
              <Text>{ cart.articlesCount } articles</Text>
              <Text style={{ fontWeight: 'bold' }}>{ cart.total } €</Text>
            </View>
            <View style={styles.cartRight}>
              <Button block style={ { alignSelf: 'flex-end' } }
                onPress={ () => navigate('Cart', { cart, client, deliveryAddress, user, onCartUpdate: cart => this.setState({ cart }) }) }>
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