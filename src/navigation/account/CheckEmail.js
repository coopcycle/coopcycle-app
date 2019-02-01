import React, { Component } from 'react'
import {
  StyleSheet,
} from 'react-native'
import {
  Container, Content, Text, Icon,
} from 'native-base'
import { translate } from 'react-i18next'

class CheckEmail extends Component {

  render() {

    const email = this.props.navigation.getParam('email', '')

    return (
      <Container>
        <Content padder contentContainerStyle={ styles.content }>
          <Icon type="FontAwesome" name="envelope-o" style={ styles.icon } />
          <Text style={{ textAlign: 'center' }}>
            { this.props.t('REGISTER_CHECK_EMAIL_DISCLAIMER', { email }) }
          </Text>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    marginBottom: 15
  }
})

module.exports = translate()(CheckEmail)
