import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Button, Radio, Switch
} from 'native-base'

import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import Modal from './components/Modal'
import LoaderOverlay from '../../components/LoaderOverlay'
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
      <Modal
        navigation={ this.props.navigation }
        title={ this.props.t('SETTINGS') }>
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
            <ListItem last>
              <Left>
                <Text>{ this.props.t('RESTAURANT_SETTINGS_CHANGE_RESTAURANT') }</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Modal>
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
    loading: state.restaurant.isFetching,
    restaurant: state.restaurant.restaurant,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: (httpClient, restaurant, state) => dispatch(changeStatus(httpClient, restaurant, state)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(SettingsScreen))
