import React, { Component } from 'react'

import BE from './../../assets/svg/BE.svg'
import ES from './../../assets/svg/ES.svg'
import FR from './../../assets/svg/FR.svg'

class Flag extends Component {

  render() {

    const props = {
      width: this.props.width,
      height: this.props.height
    }

    switch (this.props.country) {
      case 'BE':
        return (
          <BE { ...props } />
        )
      case 'ES':
        return (
          <ES { ...props } />
        )
      default:
      case 'FR':
        return (
          <FR { ...props } />
        )
    }
  }
}

export default Flag
