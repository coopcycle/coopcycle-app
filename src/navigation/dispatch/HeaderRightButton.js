import React, { Component } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

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
