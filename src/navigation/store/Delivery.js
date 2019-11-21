import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content,
  Icon, Text,
  List, ListItem, Left, Right, Body
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import MapView from 'react-native-maps'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import _ from 'lodash'

import { loadDelivery, clearDelivery } from '../../redux/Store/actions'
import { humanizeTaskTime } from '../../redux/Store/utils'
import NavigationAwareMap from '../../components/NavigationAwareMap'

class NewDelivery extends Component {

  componentDidMount() {
    this.props.loadDelivery(
      this.props.navigation.getParam('delivery')
    )
  }

  componentWillUnmount() {
    this.props.clearDelivery()
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
    recipientItems.push({ icon: 'user', text: 'John Doe' })

    if (!_.isEmpty(delivery.dropoff.comments)) {
      recipientItems.push({
        icon: 'comment',
        text: delivery.dropoff.comments,
      })
    }

    if (!!delivery.dropoff.address.telephone) {
      recipientItems.push({
        icon: 'phone',
        text: parsePhoneNumberFromString(delivery.dropoff.address.telephone).formatNational(),
      })
    }

    return (
      <Container>
        <Content contentContainerStyle={ styles.content }>
          <View style={{ backgroundColor: '#2ECC40', alignItems: 'center', paddingVertical: 15 }}>
            <Text style={{ color: '#FFFFFF' }}>
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
            <List>
              <ListItem itemDivider>
                <Text>{ this.props.t('DELIVERY_DETAILS_TIME_SLOT') }</Text>
              </ListItem>
              <ListItem>
                <Left>
                  <Icon type="FontAwesome5" name="clock" />
                </Left>
                <Text style={ styles.itemText }>{ humanizeTaskTime(delivery.dropoff) }</Text>
              </ListItem>
              <ListItem itemDivider>
                <Text>{ this.props.t('DELIVERY_DETAILS_RECIPIENT') }</Text>
              </ListItem>
              { recipientItems.map((item, i) => (
              <ListItem last={ (i + 1) === recipientItems.length } key={ `recipient-${i}` }>
                <Left>
                  <Icon type="FontAwesome5" name={ item.icon } />
                </Left>
                <Text style={ styles.itemText }>{ item.text }</Text>
              </ListItem>
              ))}
            </List>
          </View>
        </Content>
      </Container>
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
  }
})

function mapStateToProps(state, ownProps) {

  const delivery = state.store.delivery ?
    state.store.delivery : ownProps.navigation.getParam('delivery')

  return {
    delivery,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadDelivery: delivery => dispatch(loadDelivery(delivery)),
    clearDelivery: _ => dispatch(clearDelivery()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(NewDelivery))
