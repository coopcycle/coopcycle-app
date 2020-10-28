import React, { Component } from 'react'
import { connect } from 'react-redux'

import HeaderButton from '../../components/HeaderButton'
import { selectSelectedDate } from '../../coopcycle-frontend-js/lastmile/redux'

class HeaderRightButton extends Component {
  render() {

    return (
      <HeaderButton iconName="calendar"
        onPress={ () => this.props.onPress() } />
    );
  }
}

function mapStateToProps(state) {
  return {
    date: selectSelectedDate(state),
  }
}

export default connect(mapStateToProps)(HeaderRightButton)
