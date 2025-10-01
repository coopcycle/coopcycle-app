import { parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { User, Phone, MapPin, MessageCircle, Clock } from 'lucide-react-native'
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';

import NavigationAwareMap from '../../components/NavigationAwareMap';
import { loadTasks } from '../../redux/Store/actions';
import { selectDeliveries } from '../../redux/Store/selectors';
import { stateColor } from '../../utils/delivery';
import { humanizeTaskTime } from '../../utils/time-slots';

class DeliveryDetail extends Component {
  componentDidMount() {
    this.props.loadTasks(this.props.route.params?.delivery);
  }

  render() {
    const { delivery } = this.props;

    const markers = [
      {
        identifier: 'pickup',
        coordinate: delivery.pickup.address.geo,
      },
      {
        identifier: 'dropoff',
        coordinate: delivery.dropoff.address.geo,
      },
    ];

    const recipientItems = [];
    recipientItems.push({
      icon: MapPin,
      text: delivery.dropoff.address.streetAddress,
    });
    recipientItems.push({
      icon: User,
      text: delivery.dropoff.address.contactName,
    });

    if (!_.isEmpty(delivery.dropoff.address.description)) {
      recipientItems.push({
        icon: MessageCircle,
        text: delivery.dropoff.address.description,
      });
    }

    if (delivery.dropoff.address.telephone) {
      recipientItems.push({
        icon: Phone,
        text: parsePhoneNumberFromString(
          delivery.dropoff.address.telephone,
        ).formatNational(),
      });
    }

    const stateStyle = [
      styles.state,
      { backgroundColor: stateColor(delivery.state) },
    ];

    return (
      <View style={styles.content}>
        <View style={stateStyle}>
          <Text style={[styles.stateText]}>
            {this.props.t(`DELIVERY_STATE.${delivery.state}`)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationAwareMap navigation={this.props.navigation}>
            {markers.map((marker, index) => (
              <Marker {...marker} key={`marker-${index}`} flat={true} />
            ))}
          </NavigationAwareMap>
        </View>
        <View style={{ flex: 2 }}>
          <VStack className="p-3 justity-center">
            <Heading>{this.props.t('DELIVERY_DETAILS_TIME_SLOT')}</Heading>
            <HStack className="py-2 items-center">
              <Icon as={Clock} size="sm" className="mr-2" />
              <Text style={styles.itemText}>
                {humanizeTaskTime(delivery.dropoff)}
              </Text>
            </HStack>
            <Heading>{this.props.t('DELIVERY_DETAILS_RECIPIENT')}</Heading>
            {recipientItems.map((item, i) => (
              <HStack className="py-2 items-center" key={`recipient-${i}`}>
                <Icon as={item.icon} size="sm" className="mr-2" />
                <Text style={styles.itemText}>{item.text}</Text>
              </HStack>
            ))}
          </VStack>
        </View>
      </View>
    );
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
});

function mapStateToProps(state, ownProps) {
  const delivery = ownProps.route.params?.delivery;
  const deliveries = selectDeliveries(state);
  const match = _.find(
    deliveries,
    d =>
      d['@id'] === delivery['@id'] &&
      d.pickup.hasOwnProperty('status') &&
      d.dropoff.hasOwnProperty('status'),
  );

  return {
    delivery: match || delivery,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadTasks: delivery => dispatch(loadTasks(delivery)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(DeliveryDetail));
