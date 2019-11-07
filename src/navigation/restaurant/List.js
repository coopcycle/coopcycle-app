import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content, Body, Right,
  Icon, Text, Button,
  List, ListItem,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { changeRestaurant } from '../../redux/Restaurant/actions'

class ListScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _onRestaurantClick(restaurant) {
    this.props.navigation.goBack()
    this.props.changeRestaurant(restaurant)
  }

  renderRestaurants() {

    const { restaurants } = this.props

    return (
      <List>
        { restaurants.map(restaurant =>
          <ListItem key={ restaurant['@id'] } onPress={ () => this._onRestaurantClick(restaurant) }>
            <Body>
              <Text>{ restaurant.name }</Text>
            </Body>
          </ListItem>
        ) }
      </List>
    )
  }

  render() {
    return (
      <Container>
        <Content style={ styles.content }>
          <View style={ styles.helpContainer }>
            <Text style={ styles.helpText }>
              { this.props.i18n.t('RESTAURANT_LIST_CLICK_BELOW') }
            </Text>
          </View>
          { this.renderRestaurants() }
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  helpContainer: {
    paddingVertical: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})

function mapStateToProps(state) {
  return {
    restaurants: state.restaurant.myRestaurants,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeRestaurant: restaurant => dispatch(changeRestaurant(restaurant)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ListScreen))
