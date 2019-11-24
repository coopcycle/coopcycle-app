import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Text } from 'native-base'
import qs from 'qs'
import axios from 'axios'
import { withTranslation } from 'react-i18next'
import Autocomplete from 'react-native-autocomplete-input'

import { localeDetector } from '../i18n'
import Settings from '../Settings'
import AddressUtils from '../utils/Address'

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

const ListFooterComponent = () => (
  <View style={ styles.poweredContainer }>
    <Image
      resizeMode="contain"
      source={ require('../../assets/images/powered_by_google_on_white.png') } />
  </View>
)

class AddressAutocomplete extends Component {

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      results: [],
    }
  }

  _autocomplete = _.debounce((text, query) => {
    axios
      .get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&${qs.stringify(query)}`)
      .then(response => {
        this.setState({ results: response.data.predictions })
      })
  }, 300)

  _onChangeText(text) {

    this.setState({ query: text })

    if (text.length < this.props.minChars) {
      return
    }

    const query = {
      key: Settings.get('google_api_key'),
      language: localeDetector(),
      types: 'geocode',
      components: `country:${Settings.get('country').toUpperCase()}`,
    }

    this._autocomplete(text, query)
  }

  _onItemPress(item) {

    const query = {
      key: Settings.get('google_api_key'),
      language: localeDetector(),
      placeid: item.place_id,
    }

    axios
      .get(`https://maps.googleapis.com/maps/api/place/details/json?${qs.stringify(query)}`)
      .then(response => {
        this.setState({ query: item.description, results: [] })
        this.props.onSelectAddress(AddressUtils.createAddressFromGoogleDetails(response.data.result))
      })
  }

  renderItem({ item, i }) {

    return (
      <TouchableOpacity onPress={ () => this._onItemPress(item) } key={ `prediction-${i}` } style={ styles.item }>
        <Text>{ item.description }</Text>
      </TouchableOpacity>
    )
  }

  render() {

    const { onSelectAddress, ...otherProps } = this.props

    return (
      <Autocomplete
        autoCompleteType="off"
        autoCapitalize="none"
        autoCorrect={ false }
        clearButtonMode="while-editing"
        { ...otherProps }
        renderItem={ this.renderItem.bind(this) }
        data={ this.state.results }
        value={ this.state.query }
        onChangeText={ this._onChangeText.bind(this) }
        flatListProps={{ ItemSeparatorComponent, ListFooterComponent }} />
    )
  }
}

AddressAutocomplete.defaultProps = {
  minChars: 3,
}

AddressAutocomplete.propTypes = {
  minChars: PropTypes.number,
}

const styles = StyleSheet.create({
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#333',
  },
})

export default withTranslation()(AddressAutocomplete)
