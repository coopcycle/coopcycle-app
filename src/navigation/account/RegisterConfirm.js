import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Container, Content } from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { confirmRegistration } from '../../redux/App/actions'
import { selectIsAuthenticated } from '../../redux/App/selectors'

class RegisterConfirm extends Component {
  componentDidMount() {
    const token = this.props.navigation.getParam('token', null)
    if (token) {
      this.props.confirmRegistration(token)
    }
  }

  componentDidUpdate() {
    // a state when an account is successfully confirmed
    if (this.props.isAuthenticated) {
      this.props.navigation.goBack()
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
    isAuthenticated: selectIsAuthenticated(state),
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
