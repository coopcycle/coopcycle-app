import React, { Component } from 'react'
import { Button, Center, Row, ScrollView, Spinner } from 'native-base'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import Markdown from 'react-native-markdown-display'

import NavigationHolder from '../NavigationHolder'

class LegalText extends Component {

  constructor(props) {
    super(props)

    this.scrollRef = React.createRef()

    this._handleNav = this._handleNav.bind(this)
  }

  componentDidUpdate() {
    this.scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
  }

  _handleNav({ legalTextAccepted }) {
    this.props.dispatchAccept(legalTextAccepted)
    NavigationHolder.goBack()
  }

  render() {

    if (this.props.loading) {

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
            {this.props.text}
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

export default withTranslation()(LegalText)
