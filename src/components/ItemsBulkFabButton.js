import { Fab, Icon } from 'native-base';
import React, { Component } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { greenColor, whiteColor } from '../styles/common';

class ItemsBulkFabButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      items: [],
    }
  }

  addItem(item) {
    if (this.state.items.some((i) => i.id === item.id)) {
      return
    }

    this.setState({
      items: [ ...this.state.items, item ],
    })
  }

  removeItem(item) {
    this.setState({
      items: this.state.items.filter((i) => i.id !== item.id),
    })
  }

  updateItems(items) {
    this.setState({
      items: this.state.items.filter((item) => items.some((i => i.id === item.id))),
    })
  }

  renderIcon() {
    const { iconName, onPressed } = this.props

    return (
      <Icon color={whiteColor} as={FontAwesome} name={iconName} size="sm"
        onPress={() => onPressed(this.state.items)} />
    )
  }

  render() {
    return (
      <>
        {
          this.state.items.length <= 1 ? null :
          <Fab
            renderInPortal={false}
            shadow={2}
            size="sm"
            backgroundColor={greenColor}
            icon={this.renderIcon()} />
        }
      </>
    )
  }
}

export default ItemsBulkFabButton
