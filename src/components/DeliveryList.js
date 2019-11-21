import React, { Component } from 'react'
import { ActivityIndicator, Platform, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Text } from 'native-base'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

import { loadDeliveries } from '../redux/Store/actions'
import { setLoading } from '../redux/App/actions'

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#CCCCCC',
  },
  textSmall: {
    fontSize: 12,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 14,
    color: '#BBBBBB',
    fontWeight: '600',
  },
  details: {
    paddingHorizontal: 10,
  },
})

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

class DeliveryList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      next: null,
      last: null,
      totalItems: 0,
      loadingMore: false,
    }
  }

  componentDidMount() {

    this.props.setLoading(true)

    this.props.httpClient.get(`${this.props.store['@id']}/deliveries?order[dropoff.before]=desc`)
      .then(res => {
        this.props.setLoading(false)
        this.setState({
          data: res['hydra:member'],
          next: res['hydra:view']['hydra:next'],
          last: res['hydra:view']['hydra:last'],
          totalItems: res['hydra:totalItems'],
        })
      })
      .catch(e => {
        this.props.setLoading(false)
      })
  }

  _onItemPress(item) {
    if (this.state.loadingMore) {
      return
    }

    this.props.onItemPress(item)
  }

  _onEndReached() {

    if (this.state.loadingMore) {
      return
    }

    if (this.state.totalItems === this.state.data.length) {
      return
    }

    if (!this.state.next) {
      return
    }

    this.setState({
      loadingMore: true,
    })

    this.props.httpClient.get(this.state.next)
      .then(res => {
        this.setState({
          loadingMore: false,
          data: this.state.data.concat(res['hydra:member']),
          next: res['hydra:view']['hydra:next'],
          last: res['hydra:view']['hydra:last'],
          totalItems: res['hydra:totalItems'],
        })
      })
      .catch(e => {
        console.log(e)
        this.setState({
          loadingMore: false,
        })
      })
  }

  renderItem(item) {

    return (
      <TouchableOpacity onPress={ () => this._onItemPress(item) } style={ styles.item }>
        <View style={ styles.itemBody }>
          <View style={{ flex: 1 }}>
            <Text style={ styles.textSmall }>{ `#${item.id}` }</Text>
          </View>
          <View style={ [ styles.details, { flex: 6 }] }>
            <Text style={ styles.textSmall } numberOfLines={ 1 } ellipsizeMode="tail">{ item.pickup.address.streetAddress }</Text>
            <Text style={ styles.textSmall } numberOfLines={ 1 } ellipsizeMode="tail">{ item.dropoff.address.streetAddress }</Text>
          </View>
          { /* @see https://stackoverflow.com/questions/43143258/flex-vs-flexgrow-vs-flexshrink-vs-flexbasis-in-react-native */ }
          <View style={{ flex: 0, flexShrink: 1 }}>
            <Text style={ styles.textSmall } numberOfLines={ 1 }>{ moment(item.dropoff.doneBefore).format('LT') }</Text>
          </View>
        </View>
        <View >
          <Icon type="FontAwesome5" name="chevron-right" style={{ color: '#DDDDDD', fontSize: 18 }} />
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    if (!this.state.loadingMore) {
      return null
    }

    return (
      <View
        style={{
          position: 'relative',
          paddingVertical: 20,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  render() {

    if (this.state.data.length === 0) {

      return (
        <View />
      )
    }

    const groups = _.groupBy(this.state.data, item => moment(item.dropoff.doneBefore).format('LL'))
    const sections = _.map(groups, (value, key) => ({ title: key, data: value }))

    return (
      <SectionList
        stickySectionHeadersEnabled={ false }
        initialNumToRender={ 17 }
        sections={ sections }
        // scrollEnabled={ !this.state.loadingMore }
        onEndReached={ this._onEndReached.bind(this) }
        onEndReachedThreshold={ Platform.OS === 'ios' ? 0 : 0.01 }
        keyExtractor={ (item, index) => item['@id'] }
        renderItem={ ({ item }) => this.renderItem(item) }
        ItemSeparatorComponent={ ItemSeparatorComponent }
        ListFooterComponent={ this.renderFooter.bind(this) }
        renderSectionHeader={ ({ section: { title } }) => (
          <View style={ styles.header }>
            <Text style={ styles.headerText }>{ title }</Text>
          </View>
        )} />
    )
  }
}

DeliveryList.propTypes = {
  onItemPress: PropTypes.func.isRequired,
}

function mapStateToProps(state) {

  return {
    httpClient: state.app.httpClient,
    store: state.store.store,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (loading) => dispatch(setLoading(loading)),
    loadDeliveries: (store) => dispatch(loadDeliveries(store)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DeliveryList))
