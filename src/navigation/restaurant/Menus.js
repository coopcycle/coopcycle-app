import React, { Component } from 'react'
import { FlatList, InteractionManager, StyleSheet, View } from 'react-native'
import {
  Left, Right,
  ListItem, Text, Radio, Button,
} from 'native-base'
import Modal from 'react-native-modal'

import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { loadMenus, activateMenu } from '../../redux/Restaurant/actions'

class Menus extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      currentItem: null,
    }
  }

  componentDidMount() {
    this.props.loadMenus(this.props.restaurant)
  }

  renderItem(item) {

    return (
      <ListItem onPress={ () => this.setState({ isModalVisible: true, currentItem: item }) }>
        <Left>
          <Text>{ item.name }</Text>
        </Left>
        <Right>
          <Radio selected={ item.active } />
        </Right>
      </ListItem>
    )
  }

  _keyExtractor(item, index) {

    return item.identifier
  }

  _onConfirm() {
    const currentItem = { ...this.state.currentItem }
    this.setState({
      isModalVisible: false,
      currentItem: null,
    }, () => {
      InteractionManager.runAfterInteractions(() =>
        this.props.activateMenu(this.props.restaurant, currentItem))
    })
  }

  render() {

    let { menus } = this.props

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={ menus }
          keyExtractor={ this._keyExtractor }
          renderItem={ ({ item }) => this.renderItem(item) }
          initialNumToRender={ 5 } />
        <Modal isVisible={ this.state.isModalVisible }>
          <View style={ styles.modalContent }>
            <Button block warning onPress={ () => this._onConfirm() } style={{ marginBottom: 15 }}>
              <Text>{ this.props.t('RESTAURANT_SETTINGS_MENU_ACTIVATE', {
                name: this.state.currentItem ? this.state.currentItem.name : '',
              }) }</Text>
            </Button>
            <Button block bordered info onPress={ () => this.setState({ isModalVisible: false, currentItem: null }) }>
              <Text>{ this.props.t('CANCEL') }</Text>
            </Button>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant.restaurant,
    menus: state.restaurant.menus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadMenus: (restaurant) => dispatch(loadMenus(restaurant)),
    activateMenu: (restaurant, menu) => dispatch(activateMenu(restaurant, menu)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Menus))
