import React, { Component } from 'react'
import { connect } from 'react-redux'

import HeaderButton from '../../components/HeaderButton'

class HeaderRightButton extends Component {
  render() {

    return (
      <HeaderButton iconName="calendar"
        textLeft={ this.props.date.format('ll') }
        onPress={ () => this.props.onPress() } />
    );
  }
}

function mapStateToProps(state) {
  return {
    date: state.dispatch.date,
  }
}

export default connect(mapStateToProps)(HeaderRightButton)
