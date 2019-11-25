import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content,
  Icon, Text,
  List, ListItem, Left,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import MapView from 'react-native-maps'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import _ from 'lodash'

import { loadTasks } from '../../redux/Store/actions'
import { selectDeliveries } from '../../redux/Store/selectors'
import { humanizeTaskTime } from '../../utils/time-slots'
import NavigationAwareMap from '../../components/NavigationAwareMap'

class NewDelivery extends Component {

  componentDidMount() {
    this.props.loadTasks(
      this.props.navigation.getParam('delivery')
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

    if (!!delivery.dropoff.address.telephone) {
      recipientItems.push({
        icon: 'phone',
        text: parsePhoneNumberFromString(delivery.dropoff.address.telephone).formatNational(),
      })
    }

    const stateStyle = [ styles.state ]

    switch (delivery.state) {
    case 'new':
      stateStyle.push(styles.stateNew)
      break
    case 'picked':
      stateStyle.push(styles.statePicked)
      break
    case 'fulfilled':
      stateStyle.push(styles.stateFulfilled)
      break
    default:
      stateStyle.push(styles.stateUnknown)
      break
    }

    return (
      <Container>
        <Content contentContainerStyle={ styles.content }>
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
            <List>
              <ListItem itemDivider>
                <Text>{ this.props.t('DELIVERY_DETAILS_TIME_SLOT') }</Text>
              </ListItem>
              <ListItem last>
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
  },
  state: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  stateText: {
    color: '#FFFFFF',
  },
  stateUnknown: {
    backgroundColor: '#bdc3c7',
  },
  stateNew: {
    backgroundColor: '#f1c40f',
  },
  statePicked: {
    backgroundColor: '#3498db',
  },
  stateFulfilled: {
    backgroundColor: '#2ecc71',
  },
})

function mapStateToProps(state, ownProps) {

  const delivery = ownProps.navigation.getParam('delivery')
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
