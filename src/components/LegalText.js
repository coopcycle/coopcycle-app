import React, { Component } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { connect } from 'react-redux'
import { Text, ScrollView } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import Markdown from 'react-native-markdown-display'

import { localeDetector } from '../i18n'

class LegalText extends Component {

  constructor(props) {
    super(props)
    this.state = {
      text: null,
    }
  }

  componentDidMount() {
    axios
      .get(`http://coopcycle.org/${this.props.type}/${this.props.language}.md`)
      .then((response) => {
        this.setState({ text: response.data })
      })
      .catch(e => {
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          axios
            .get(`http://coopcycle.org/${this.props.type}/en.md`)
            .then((response) => {
              this.setState({ text: response.data })
            })
        }
      })
  }

  render() {

    if (!this.state.text) {

      return null
    }

    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: '100%' }}
          px="4"
        >
          <Markdown>
            { this.state.text }
          </Markdown>
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

export default connect(mapStateToProps)(withTranslation()(LegalText))
