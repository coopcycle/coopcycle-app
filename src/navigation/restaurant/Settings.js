import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Switch,
} from 'native-base'

import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { changeStatus } from '../../redux/Restaurant/actions'

class SettingsScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      restaurantState: props.restaurant.state,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.restaurantState !== prevState.restaurantState) {
      this.props.changeStatus(this.props.restaurant, this.state.restaurantState)
    }
  }

  _onRushValueChange(value) {
    this.setState({ restaurantState: value ? 'rush' : 'normal' })
  }

  render() {

    const { navigate } = this.props.navigation
    const { restaurants } = this.props

    const items = [
      {
        icon: 'flame',
        label: this.props.t('RESTAURANT_SETTINGS_RUSH'),
        switch: (
          <Switch
            value={ this.state.restaurantState === 'rush' }
            onValueChange={ this._onRushValueChange.bind(this) } />
        ),
      },
      {
        icon: 'pricetag',
        label: this.props.t('RESTAURANT_SETTINGS_MANAGE_PRODUCTS'),
        onPress: () => navigate('RestaurantProducts'),
      },
      {
        icon: 'calendar',
        label: this.props.t('RESTAURANT_SETTINGS_OPENING_HOURS'),
        onPress: () => navigate('RestaurantOpeningHours'),
      },
      {
        icon: 'calendar',
        label: this.props.t('RESTAURANT_SETTINGS_MENUS'),
        onPress: () => navigate('RestaurantMenus'),
      },
    ]

    if (restaurants.length > 1) {
      items.push(
        {
          icon: 'calendar',
          label: this.props.t('RESTAURANT_SETTINGS_CHANGE_RESTAURANT'),
          onPress: () => navigate('RestaurantList'),
        }

      )
    }

    return (
      <Container>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            { this.props.t('RESTAURANT_SETTINGS_HEADING', { name: this.props.restaurant.name }) }
          </Text>
        </View>
        <Content style={ styles.content }>
          <List>
            { items.map((item, index) => {

              let itemProps = {}

              if (index === (items.length - 1)) {
                itemProps = {
                  ...itemProps,
                  last: true,
                }
              }

              if (index === 0) {
                itemProps = {
                  ...itemProps,
                  first: true,
                }
              }

              if (item.onPress) {
                itemProps = {
                  ...itemProps,
                  onPress: item.onPress,
                }
              }

              return (
                <ListItem key={ `item-${index}` } icon { ...itemProps }>
                  <Left>
                    <Icon active name={ item.icon } />
                  </Left>
                  <Body>
                    <Text>{ item.label }</Text>
                  </Body>
                  <Right>
                    { item.switch && item.switch }
                  </Right>
                </ListItem>
              )
            }) }
          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
  },
})

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    restaurant: state.restaurant.restaurant,
    restaurants: state.restaurant.myRestaurants,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: (restaurant, state) => dispatch(changeStatus(restaurant, state)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SettingsScreen))
