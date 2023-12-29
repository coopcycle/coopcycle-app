// @see https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values'
import React, { Component } from 'react'
import { Appearance, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Icon, Text, useColorMode } from 'native-base'
import qs from 'qs'
import axios from 'axios'
import { withTranslation } from 'react-i18next'
import Autocomplete from 'react-native-autocomplete-input'
import Fuse from 'fuse.js'
import { v4 as uuidv4 } from 'uuid'
import Config from 'react-native-config'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { AbortController } from 'abortcontroller-polyfill/dist/cjs-ponyfill'
import { connect } from 'react-redux'
import { circle, transformRotate } from '@turf/turf'

import { localeDetector } from '../i18n'
import AddressUtils from '../utils/Address'
import ItemSeparator from './ItemSeparator'

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
  ],
}

const PoweredByGoogle = () => {

  const { colorMode } = useColorMode()

  return (
    <View style={ [ styles.poweredContainer, { backgroundColor: colorMode === 'dark' ? 'black' : 'white' }] }>
      { colorMode !== 'dark' && <Image
        resizeMode="contain"
        source={ require('../../assets/images/powered_by_google_on_white.png') } /> }
      { colorMode === 'dark' && <Image
        resizeMode="contain"
        source={ require('../../assets/images/powered_by_google_on_non_white.png') } /> }
    </View>
  )
}

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
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: '#0984e3', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
      onPress={ onPress }>
      <Text style={{
        marginRight: 10,
        fontWeight: '700',
        fontSize: 16,
        color: 'white',
        fontFamily: 'RobotoMono-Regular',
      }}>{ postcode }</Text>
      <Icon as={FontAwesome5} name="times" style={{ fontSize: 18, color: 'white' }} />
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
      sessionToken: null,
      controller: null,
    }
    this.fuse = new Fuse(this.props.addresses, fuseOptions)
  }

  _autocomplete = _.debounce((text, query) => {

    this.setState({ controller: new AbortController() })
    const fuseResults = this.fuse.search(text, {
      limit: 2,
    })

    if (this.props.country === 'gb') {

      if (!this.state.postcode) {

        axios.get(`https://api.postcodes.io/postcodes/${text.replace(/\s/g, '')}/autocomplete`, {
          signal: this.state.controller.signal,
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

      // @see https://developers.google.com/places/web-service/autocomplete
      axios
        .get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&${qs.stringify(query)}`, {
          signal: this.state.controller.signal,
        })
        .then(response => {

          const normalizedResults =
            fuseResults.map(fuseResult => ({
              ...fuseResult.item,
              type: 'fuse',
            }))

          const normalizedPredictions =
            response.data.predictions.map(prediction => ({
              ...prediction,
              type: 'prediction',
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

    let newState = { query: text }

    this.state.controller?.abort()

    // @see https://developers.google.com/places/web-service/autocomplete#session_tokens
    let sessionToken = ''
    if (!this.state.sessionToken) {
      sessionToken = uuidv4()
      newState = { ...newState, sessionToken }
    } else {
      sessionToken = this.state.sessionToken
    }

    this.setState(newState)

    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }

    if (text.length < this.props.minChars) {
      this.setState({ results: [] })
      return
    }

    let query = {
      key: Config.GOOGLE_MAPS_BROWSER_KEY,
      language: localeDetector(),
      types: 'geocode',
      // https://developers.google.com/maps/documentation/places/web-service/autocomplete?hl=fr#locationrestriction
      // Rectangular: A string specifying two lat/lng pairs in decimal degrees, representing the south/west and north/east points of a rectangle.
      // Use the following format:rectangle:south,west|north,east.
      // Note that east/west values are wrapped to the range -180, 180, and north/south values are clamped to the range -90, 90.
      locationrestriction: `rectangle:${this.props.southWest}|${this.props.northEast}`,
      sessiontoken: sessionToken,
    }

    this._autocomplete(text, query)
  }

  _onItemPress(item) {

    if (item.type === 'prediction') {

      const { sessionToken } = this.state

      const query = {
        key: Config.GOOGLE_MAPS_BROWSER_KEY,
        language: localeDetector(),
        placeid: item.place_id,
        sessiontoken: sessionToken,
      }

      // https://developers.google.com/places/web-service/session-tokens
      // The session begins when the user starts typing a query,
      // and concludes when they select a place and a call to Place Details is made.
      this.setState({ sessionToken: null })

      // @see https://developers.google.com/places/web-service/details
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

    const itemStyle = [styles.item]

    let text = item.description

    if (item.type === 'fuse') {

      const parts = [item.streetAddress]
      if (item.contactName && item.contactName.length > 0) {
        parts.unshift(item.contactName)
      }
      text = parts.join(' - ')
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
        testID:  `placeId:${item.place_id}`,
      }
    }

    return (
      <TouchableOpacity onPress={ () => this._onItemPress(item) } style={ itemStyle } { ...itemProps }>
        <Text style={{ fontSize: 14, flex: 1, color: '#856404' }} numberOfLines={1} ellipsizeMode="tail">
          { text }</Text>
        { item.type === 'fuse' && (
          <Icon as={FontAwesome5} name="star" regular style={{ fontSize: 16, color: '#856404', paddingLeft: 5 }} />
        ) }
      </TouchableOpacity>
    )
  }

  onTextInputFocus(e) {
    if (this.props.addresses.length > 0) {
      this.setState({
        results: this.props.addresses.map(address => ({
          ...address,
          type: 'fuse',
        })),
      })
    }
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(e)
    }
  }

  onTextInputBlur(e) {
    this.setState({
      results: [],
    })
    if (this.props.onBlur && typeof this.props.onBlur === 'function') {
      this.props.onBlur(e)
    }
  }

  renderTextInput(props) {

    return (
      <View style={ styles.textInput }>
        <View style={ styles.textInput }>
          <TextInput { ...props } style={ [ props.style, { flex: 1 }] }
            onFocus={ this.onTextInputFocus.bind(this) }
            onBlur={ this.onTextInputBlur.bind(this) } />
          { (this.props.country === 'gb' && this.state.postcode) && (
            <PostCodeButton postcode={ this.state.postcode.postcode } onPress={ () => {
              this.setState({
                query: '',
                results: [],
                postcode: null,
              })
            }} />
          ) }
        </View>
        { this.props.renderRight() }
      </View>
    )
  }

  render() {

    const colorScheme = Appearance.getColorScheme()
    const { style, flatListProps, onSelectAddress, renderTextInput, placeholder, ...otherProps } = this.props

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
        data={ this.state.results }
        value={ this.state.query }
        placeholder={ finalPlaceholder }
        onChangeText={ this._onChangeText.bind(this) }
        flatListProps={{
          style: { margin: 0 }, // reset default margins on Android
          keyboardShouldPersistTaps: 'always',
          keyExtractor: (item, i) => `prediction-${i}`,
          renderItem: this.renderItem.bind(this),
          ItemSeparatorComponent: ItemSeparator,
          ListFooterComponent: (this.props.country === 'gb' ? PoweredByIdealPostcodes : PoweredByGoogle),
          ...flatListProps,
        }}
        renderTextInput={ props => this.renderTextInput(props) }
        listContainerStyle={{
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        }}
        style={{
          color: colorScheme === 'dark' ? 'white' : '#333',
          borderColor: '#b9b9b9',
          borderRadius: 20,
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderWidth: 1,
          ...style,
        }}
        />
    )
  }
}

AddressAutocomplete.defaultProps = {
  minChars: 3,
  addresses: [],
  renderRight: () => <View />,
}

AddressAutocomplete.propTypes = {
  minChars: PropTypes.number,
  addresses: PropTypes.array,
  renderRight: PropTypes.func,
}

const styles = StyleSheet.create({
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

function mapStateToProps(state) {

  const [ lat, lng ] = state.app.settings.latlng.split(',')

  // This will create a polygon with 4 sides (i.e a square)
  const options = { steps: 4, units: 'kilometers' }
  const polygon = circle([ lng, lat ], 50, options)
  const bbox = transformRotate(polygon, 45)

  const northEast = bbox.geometry.coordinates[0][0]
  const southWest = bbox.geometry.coordinates[0][2]

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    northEast: [ northEast[1], northEast[0] ].join(','),
    southWest: [ southWest[1], southWest[0] ].join(','),
  }
}

export default connect(mapStateToProps)(withTranslation()(AddressAutocomplete))
