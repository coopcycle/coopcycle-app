import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Button, Radio, Switch
} from 'native-base'

import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { changeStatus } from '../../redux/Restaurant/actions'

class SettingsScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      restaurantState: props.restaurant.state
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.restaurantState !== prevState.restaurantState) {
      this.props.changeStatus(this.props.httpClient, this.props.restaurant, this.state.restaurantState)
    }
  }

  _onRushValueChange(value) {
    this.setState({ restaurantState: value ? 'rush' : 'normal' })
  }

  render() {
    return (
      <Container>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            { this.props.t('RESTAURANT_SETTINGS_HEADING', { name: this.props.restaurant.name }) }
          </Text>
        </View>
        <Content style={ styles.content }>
          <List>
            <ListItem icon first>
              <Left>
                <Icon active name="flame" />
              </Left>
              <Body>
                <Text>{ this.props.t('RESTAURANT_SETTINGS_RUSH') }</Text>
              </Body>
              <Right>
                <Switch
                  value={ this.state.restaurantState === 'rush' }
                  onValueChange={ this._onRushValueChange.bind(this) } />
              </Right>
            </ListItem>
            <ListItem icon onPress={ () => this.props.navigation.navigate('RestaurantProducts') }>
              <Left>
                <Icon active name="pricetag" />
              </Left>
              <Body>
                <Text>{ this.props.t('RESTAURANT_SETTINGS_MANAGE_PRODUCTS') }</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon last onPress={ () => this.props.navigation.navigate('RestaurantOpeningHours') }>
              <Left>
                <Icon active name="calendar" />
              </Left>
              <Body>
                <Text>{ this.props.t('RESTAURANT_SETTINGS_OPENING_HOURS') }</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20
  }
})

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    restaurant: state.restaurant.restaurant,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: (httpClient, restaurant, state) => dispatch(changeStatus(httpClient, restaurant, state)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(SettingsScreen))
