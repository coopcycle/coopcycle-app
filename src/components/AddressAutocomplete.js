import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native'
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

const PoweredByGoogle = () => (
  <View style={ styles.poweredContainer }>
    <Image
      resizeMode="contain"
      source={ require('../../assets/images/powered_by_google_on_white.png') } />
  </View>
)

const PoweredByIdealPostcodes = () => (
  <View style={ styles.poweredContainer }>
    <Image
      resizeMode="contain"
      source={ require('../../assets/images/ideal_postcodes.png') } />
  </View>
)

const PostCodeButton = ({ postcode, onPress }) => {
  return (
    <TouchableOpacity style={{
      flexDirection: 'row', alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      paddingVertical: 5,
      position: 'absolute', right: 1, backgroundColor: '#0984e3', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
      onPress={ onPress }>
      <Text style={{ marginRight: 10, fontWeight: '700', fontSize: 16, color: 'white', fontFamily: 'RobotoMono-Regular' }}>{ postcode }</Text>
      <Icon type="FontAwesome5" name="times" style={{ fontSize: 18, color: 'white' }} />
    </TouchableOpacity>
  )
}

class AddressAutocomplete extends Component {

  constructor(props) {

    super(props)

    this.state = {
      query: _.isObject(props.value) ? (props.value.streetAddress || '') : (props.value || ''),
      results: [],
      postcode: _.isObject(props.value) ? { postcode: props.value.postalCode } : null,
    }
    this.fuse = new Fuse(this.props.addresses, fuseOptions)
  }

  _autocomplete = _.debounce((text, query) => {

    const fuseResults = this.fuse.search(text, {
      limit: 2
    })

    if (this.props.country === 'gb') {

      if (!this.state.postcode) {

        axios({
          method: 'get',
          url: `https://api.postcodes.io/postcodes/${text.replace(/\s/g, '')}/autocomplete`,
        })
          .then(response => {
            if (response.data.status === 200 && Array.isArray(response.data.result)) {
              const normalizedPostcodes = response.data.result.map(postcode => ({
                postcode: postcode,
                type: 'postcode',
              }))
              this.setState({
                results: normalizedPostcodes,
              })
            }
          })

      } else {
        this.setState({
          results: [{
            type: 'manual_address',
            description: text,
          }],
        })
      }

    } else {

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

    }

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

    if (item.type === 'postcode') {
      axios({
        method: 'get',
        url: `https://api.postcodes.io/postcodes/${item.postcode}`,
      })
        .then(response => {
          if (response.data.status === 200 && response.data.result) {
            this.setState({
              query: '',
              results: [],
              postcode: response.data.result,
            })
          }
        })
    }

    if (item.type === 'fuse') {
      this.props.onSelectAddress(item)
    }

    if (item.type === 'manual_address') {

      this.setState({
        results: [],
      })
      this.props.onSelectAddress(
        AddressUtils.createAddressFromPostcode(this.state.postcode, item.description)
      )
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

    if (item.type === 'postcode') {
      text = item.postcode
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

  renderTextInput(props) {

    return (
      <View style={ styles.textInput }>
        <View style={ styles.textInput }>
          <TextInput { ...props } style={ [ props.style, { flex: 1 } ] } />
          { (this.props.country === 'gb' && this.state.postcode) && (
            <PostCodeButton postcode={ this.state.postcode.postcode } onPress={ () => {
              this.setState({
                query: '',
                results: [],
                postcode: null
              })
            }} />
          ) }
        </View>
        { this.props.renderRight() }
      </View>
    )
  }

  render() {

    const { onSelectAddress, renderTextInput, placeholder, ...otherProps } = this.props

    let finalPlaceholder = placeholder || this.props.t('ENTER_ADDRESS')
    if (this.props.country === 'gb' && !this.state.postcode) {
      finalPlaceholder = this.props.t('ENTER_POSTCODE')
    }

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
        placeholder={ finalPlaceholder }
        onChangeText={ this._onChangeText.bind(this) }
        keyExtractor={ (item, i) => `prediction-${i}` }
        flatListProps={{ ItemSeparatorComponent,
          ListFooterComponent: (this.props.country === 'gb' ? PoweredByIdealPostcodes : PoweredByGoogle)
        }}
        renderTextInput={ props => this.renderTextInput(props) }
        listStyle={{
          margin: 0,
        }}
        style={{
          backgroundColor: 'white',
          borderColor: '#b9b9b9',
          borderRadius: 20,
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderWidth: 1,
        }}
        />
    )
  }
}

AddressAutocomplete.defaultProps = {
  minChars: 3,
  addresses: [],
  renderRight: () => <View />
}

AddressAutocomplete.propTypes = {
  minChars: PropTypes.number,
  addresses: PropTypes.array,
  googleApiKey: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  renderRight: PropTypes.func,
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
  textInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default withTranslation()(AddressAutocomplete)
