import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Icon, Text } from 'native-base'
import qs from 'qs'
import axios from 'axios'
import { withTranslation } from 'react-i18next'
import Autocomplete from 'react-native-autocomplete-input'
import Fuse from 'fuse.js'

import { localeDetector } from '../i18n'
import AddressUtils from '../utils/Address'

const fuseOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'contactName',
    'streetAddress',
  ]
}

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
      query: props.value || '',
      results: [],
    }
    this.fuse = new Fuse(this.props.addresses, fuseOptions)
  }

  _autocomplete = _.debounce((text, query) => {

    const fuseResults = this.fuse.search(text, {
      limit: 2
    })

    axios
      .get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&${qs.stringify(query)}`)
      .then(response => {

        const normalizedResults =
          fuseResults.map(fuseResult => ({
            ...fuseResult.item,
            type: 'fuse',
          }))

        const normalizedPredictions =
          response.data.predictions.map(prediction => ({
            ...prediction,
            type: 'prediction'
          }))

        const results = normalizedResults.concat(normalizedPredictions)

        if (normalizedResults.length > 0 && results.length > 5) {
          results.splice(5)
        }

        this.setState({ results })
      })

  }, 300)

  _onChangeText(text) {

    this.setState({ query: text })

    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }

    if (text.length < this.props.minChars) {
      return
    }

    const query = {
      key: this.props.googleApiKey,
      language: localeDetector(),
      types: 'geocode',
      components: `country:${this.props.country.toUpperCase()}`,
    }

    this._autocomplete(text, query)
  }

  _onItemPress(item) {

    if (item.type === 'prediction') {
      const query = {
        key: this.props.googleApiKey,
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

    if (item.type === 'fuse') {
      this.props.onSelectAddress(item)
    }
  }

  renderItem({ item, i }) {

    const itemStyle = [ styles.item ]

    let text = item.description

    if (item.type === 'fuse') {
      text = [ item.contactName, item.streetAddress ].join(' - ')
      itemStyle.push({
        backgroundColor: '#fff3cd',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      })
    }

    let itemProps = {}
    if (item.type === 'prediction') {
      itemProps = {
        ...itemProps,
        testID:  `placeId:${item.place_id}`
      }
    }

    return (
      <TouchableOpacity onPress={ () => this._onItemPress(item) } style={ itemStyle } { ...itemProps }>
        <Text style={{ fontSize: 14, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{ text }</Text>
        { item.type === 'fuse' && (
          <Icon type="FontAwesome5" name="star" regular style={{ fontSize: 16, color: '#856404', paddingLeft: 5 }} />
        ) }
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
        keyExtractor={ (item, i) => `prediction-${i}` }
        flatListProps={{ ItemSeparatorComponent, ListFooterComponent }} />
    )
  }
}

AddressAutocomplete.defaultProps = {
  minChars: 3,
  addresses: [],
}

AddressAutocomplete.propTypes = {
  minChars: PropTypes.number,
  addresses: PropTypes.array,
  googleApiKey: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
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
