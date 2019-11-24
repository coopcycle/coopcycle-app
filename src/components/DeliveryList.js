import React, { Component } from 'react'
import { ActivityIndicator, Platform, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

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

const SectionHeaderComponent = ({ title }) => (
  <View style={ styles.header }>
    <Text style={ styles.headerText }>{ title }</Text>
  </View>
)

class DeliveryList extends Component {

  _onItemPress(item) {
    if (this.props.loading) {
      return
    }

    this.props.onItemPress(item)
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
    if (!this.props.loading) {
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

    if (this.props.data.length === 0) {

      return (
        <View />
      )
    }

    const groups = _.groupBy(this.props.data, item => moment(item.dropoff.doneBefore).format('LL'))
    const sections = _.map(groups, (value, key) => ({ title: key, data: value }))

    return (
      <SectionList
        stickySectionHeadersEnabled={ false }
        initialNumToRender={ 17 }
        sections={ sections }
        // scrollEnabled={ !this.state.loadingMore }
        onEndReached={ this.props.onEndReached }
        onEndReachedThreshold={ Platform.OS === 'ios' ? 0 : 0.01 }
        keyExtractor={ (item, index) => item['@id'] }
        renderItem={ ({ item }) => this.renderItem(item) }
        ItemSeparatorComponent={ ItemSeparatorComponent }
        ListFooterComponent={ this.renderFooter.bind(this) }
        renderSectionHeader={ ({ section: { title } }) => (
          <SectionHeaderComponent title={ title } />
        )} />
    )
  }
}

DeliveryList.defaultProps = {
  data: [],
  loading: false,
}

DeliveryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onItemPress: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
}

export default withTranslation()(DeliveryList)
