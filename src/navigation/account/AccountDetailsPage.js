import React, { Component } from 'react'
import { InteractionManager } from 'react-native'
import {
  Container, Content,
  Icon,
  Label, Item, Input,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { loadPersonalInfo } from '../../redux/Account/actions'

class AccountDetailsPage extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadPersonalInfo()
    })
  }

  render() {

    const { email, username } = this.props

    return (
      <Container>
        <Content style={{ paddingHorizontal: 10, paddingTop: 20 }}>
          { username ? (
            <Item stackedLabel disabled>
              <Label>{this.props.t('USERNAME')}</Label>
              <Input disabled placeholder={ username } />
              <Icon name="information-circle" />
            </Item>
          ) : null }
          { email ? (
            <Item stackedLabel disabled>
              <Label>{this.props.t('EMAIL')}</Label>
              <Input disabled placeholder={ email } />
              <Icon name="information-circle" />
            </Item>
          ) : null }
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  return {
    email: state.account.email,
    username: state.account.username,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadPersonalInfo: () => dispatch(loadPersonalInfo()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountDetailsPage))
