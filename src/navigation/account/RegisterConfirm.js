import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Container, Content, Button, Text, Icon,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { confirmRegistration } from '../../redux/App/actions'

class RegisterConfirm extends Component {

  componentDidMount() {
    const token = this.props.navigation.getParam('token', null)
    if (token) {
      this.props.confirmRegistration(token)
    }
  }

  render() {

    return (
      <Container>
        <Content padder contentContainerStyle={ styles.content } />
      </Container>
    );
  }
}

function mapStateToProps(state) {

  return {
  }
}

function mapDispatchToProps(dispatch) {

  return {
    confirmRegistration: token => dispatch(confirmRegistration(token)),
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 15,
  },
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RegisterConfirm))
