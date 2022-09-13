import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Center, Row, ScrollView, Spinner } from 'native-base'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import Markdown from 'react-native-markdown-display'

import { localeDetector } from '../i18n'
import NavigationHolder from '../NavigationHolder'
import { acceptPrivacyPolicy, acceptTermsAndConditions } from '../redux/App/actions'

class LegalText extends Component {

  constructor(props) {
    super(props)
    this.state = {
      text: null,
      showConfirmationButtons: this.props.showConfirmationButtons,
    }

    this.scrollRef = React.createRef()

    this._handleNav = this._handleNav.bind(this)
  }

  componentDidMount() {
    axios
      .get(`https://coopcycle.org/${this.props.type}/${this.props.language}.md`)
      .then((response) => {
        this.setState({ text: response.data })
      })
      .catch(e => {
        axios
          .get(`https://coopcycle.org/${this.props.type}/en.md`)
          .then((response) => {
            this.setState({ text: response.data })
          })
      })
  }

  componentDidUpdate() {
    this.scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.showConfirmationButtons !== prevState.showConfirmationButtons) {
      // reload component data if prop has changed
      return {
        text: prevState.text, // keep text to avoid a new api call
        showConfirmationButtons: nextProps.showConfirmationButtons,
      }
    }
    return prevState;
  }

  _handleNav({ legalTextAccepted }) {
    if (this.props.type === 'terms') {
      this.props.acceptTermsAndConditions(legalTextAccepted)
    } else if (this.props.type === 'privacy') {
      this.props.acceptPrivacyPolicy(legalTextAccepted)
    }
    NavigationHolder.goBack()
  }

  render() {

    if (!this.state.text) {

      return (
        <Center flex={1}>
          <Spinner size="lg" />
        </Center>
      )
    }

    return (
      <SafeAreaView>
        <ScrollView
          ref={this.scrollRef}
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: '100%' }}
          px="4"
        >
          <Markdown>
            {this.state.text}
          </Markdown>
          {
            this.props.showConfirmationButtons &&
            <Row justifyContent="space-between" space={10} my={4}>
              <Button onPress={() => this._handleNav({ legalTextAccepted: false })}>
                {this.props.t('CANCEL')}
              </Button>
              <Button flex={1} colorScheme="success" onPress={() => this._handleNav({ legalTextAccepted: true })}>
                {this.props.t('AGREE')}
              </Button>
            </Row>
          }
        </ScrollView>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {

  return {
    language: localeDetector(),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    acceptTermsAndConditions: (accepted) => dispatch(acceptTermsAndConditions(accepted)),
    acceptPrivacyPolicy: (accepted) => dispatch(acceptPrivacyPolicy(accepted)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LegalText))
