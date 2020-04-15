import React, { Component } from 'react'
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { Button, Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { SafeAreaView } from 'react-navigation'
import axios from 'axios'

import { selectServer } from '../../redux/App/actions'
import ItemSeparator from '../../components/ItemSeparator'
import { localeDetector } from '../../i18n'

class About extends Component {

  constructor(props) {
    super(props)
    this.state = {
      instance: null,
    }
  }

  componentDidMount() {
    axios
      .get('https://coopcycle.org/coopcycle.json')
      .then((response) => {
        const instance = _.find(response.data, i => i.coopcycle_url === this.props.baseURL)
        this.setState({ instance })
      })
      .catch(e => console.log(e))
  }

  renderText() {
    const { instance } = this.state

    if (!instance.text) {

      return null
    }

    const languages = _.keys(instance.text)

    if (languages.length === 0) {

      return null
    }

    let text = ''
    if (languages.length === 1) {
      text = instance.text[languages[0]]
    } else {
      if (instance.text[this.props.language]) {
        text = instance.text[this.props.language]
      }
    }

    // Strip HTML
    text = text.replace(/(<([^>]+)>)/ig, '')

    return (
      <Text style={{ textAlign: 'center', paddingHorizontal: '10%' }}>{ text }</Text>
    )
  }

  renderContent() {

    const { instance } = this.state

    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', marginBottom: 5, fontWeight: '700' }}>{ this.props.t('ABOUT_INSTANCE', { name: instance.name }) }</Text>
        <Text note style={{ textAlign: 'center', marginBottom: 10 }}>{ instance.city }</Text>
        { this.props.logo && (
          <View style={{ width: 128, height: 128, backgroundColor: 'red', marginBottom: 10 }}>
            <Image style={{ flex: 1, height: undefined, width: undefined }} source={{ uri: this.props.logo }} />
          </View>
        )}
        { this.renderText() }

      </View>
    )
  }

  render() {

    const { instance } = this.state

    return (
      <SafeAreaView style={ styles.container }>
        { !instance && (<ActivityIndicator size="large" color="#0000ff" />) }
        { instance && this.renderContent() }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

function mapStateToProps(state) {

  return {
    baseURL: state.app.baseURL,
    logo: state.app.settings.logo,
    language: localeDetector(),
  }
}

export default connect(mapStateToProps)(withTranslation()(About))
