import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  HStack, Heading, Icon, Text, VStack,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import MapView from 'react-native-maps'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import _ from 'lodash'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { loadTasks } from '../../redux/Store/actions'
import { selectDeliveries } from '../../redux/Store/selectors'
import { humanizeTaskTime } from '../../utils/time-slots'
import NavigationAwareMap from '../../components/NavigationAwareMap'
import { stateColor } from '../../utils/delivery'

class NewDelivery extends Component {

  componentDidMount() {
    this.props.loadTasks(
      this.props.route.params?.delivery
    )
  }

  render() {

    const { delivery } = this.props

    const markers = [{
      identifier: 'pickup',
      coordinate: delivery.pickup.address.geo,
    }, {
      identifier: 'dropoff',
      coordinate: delivery.dropoff.address.geo,
    }]

    const recipientItems = []
    recipientItems.push({ icon: 'map-marker-alt', text: delivery.dropoff.address.streetAddress })
    recipientItems.push({ icon: 'user', text: delivery.dropoff.address.contactName })

    if (!_.isEmpty(delivery.dropoff.address.description)) {
      recipientItems.push({
        icon: 'comment',
        text: delivery.dropoff.address.description,
      })
    }

    if (delivery.dropoff.address.telephone) {
      recipientItems.push({
        icon: 'phone',
        text: parsePhoneNumberFromString(delivery.dropoff.address.telephone).formatNational(),
      })
    }

    const stateStyle = [ styles.state, { backgroundColor: stateColor(delivery.state) } ]

    return (
      <View style={ styles.content }>
        <View style={ stateStyle }>
          <Text style={ [ styles.stateText ] }>
            { this.props.t(`DELIVERY_STATE.${delivery.state}`) }
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationAwareMap navigation={ this.props.navigation }>
            { markers.map((marker, index) => (
              <MapView.Marker
                { ...marker }
                key={ `marker-${index}` }
                flat={ true } />
            )) }
          </NavigationAwareMap>
        </View>
        <View style={{ flex: 2 }}>
          <VStack p="3">
            <Heading>{ this.props.t('DELIVERY_DETAILS_TIME_SLOT') }</Heading>
            <HStack py="2">
              <Icon as={FontAwesome5} name="clock" size="sm" mr="2" />
              <Text style={ styles.itemText }>{ humanizeTaskTime(delivery.dropoff) }</Text>
            </HStack>
            <Heading>{ this.props.t('DELIVERY_DETAILS_RECIPIENT') }</Heading>
            { recipientItems.map((item, i) => (
            <HStack py="2" key={ `recipient-${i}` }>
              <Icon as={FontAwesome5} name={ item.icon } size="sm" mr="2" />
              <Text style={ styles.itemText }>{ item.text }</Text>
            </HStack>
            ))}
          </VStack>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 10,
    borderColor: '#d7d7d7',
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 14,
  },
  state: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  stateText: {
    color: '#FFFFFF',
  },
})

function mapStateToProps(state, ownProps) {

  const delivery = ownProps.route.params?.delivery
  const deliveries = selectDeliveries(state)
  const match = _.find(deliveries, d => d['@id'] === delivery['@id'] && d.pickup.hasOwnProperty('status') && d.dropoff.hasOwnProperty('status'))

  return {
    delivery: match || delivery,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadTasks: delivery => dispatch(loadTasks(delivery)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(NewDelivery))
