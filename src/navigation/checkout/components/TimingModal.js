import { groupBy, map, reduce } from 'lodash';
import moment from 'moment';
import {
  Button,
  Divider,
  HStack,
  Heading,
  Skeleton,
  Text,
  View,
} from 'native-base';
import PropTypes from 'prop-types';
import React, { Component, useEffect, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';
import BottomModal from '../../../components/BottomModal';
import { Picker } from '../../../components/Picker';
import { selectHttpClient } from '../../../redux/App/selectors';
import { showTimingModal } from '../../../redux/Checkout/actions';

const TimingCartSelect = ({
  cart: { cart, token },
  httpClient,
  onValueChange,
  cartFulfillmentMethod,
}) => {
  httpClient = httpClient.cloneWithToken(token);
  const { data, isSuccess } = useQuery(
    ['cart', 'timing', cartFulfillmentMethod, cart['@id']],
    async () => {
      return await httpClient.get(`${cart['@id']}/timing`);
    },
  );

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedRange, setSelectedRange] = useState(0);

  useEffect(() => {
    setSelectedRange(0);
    setSelectedDay(0);
  }, [cartFulfillmentMethod]);

  const values = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    return reduce(
      groupBy(data.ranges, d => moment(d[0]).startOf('day').format()),
      (acc, day, index) => {
        acc.push({
          day: moment(index),
          values: map(day, range => ({
            value: range,
            label: `${moment(range[0]).format('LT')} - ${moment(
              range[1],
            ).format('LT')}`,
          })),
        });
        return acc;
      },
      [],
    );
  }, [data, isSuccess]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    if (values.length < selectedDay) {
      return;
    }

    onValueChange(values[selectedDay].values[selectedRange].value);
  }, [selectedDay, selectedRange, values, isSuccess, onValueChange]);

  const dayItems = useMemo(() => {
    return (
      isSuccess &&
      values.map((day, index) => (
        <Picker.Item
          value={index}
          label={day.day.format('ddd DD MMMM')}
          key={index}
        />
      ))
    );
  }, [isSuccess, values]);

  const slotItems = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    if (values.length < selectedDay) {
      return null;
    }

    return values[selectedDay].values.map((range, index) => (
      <Picker.Item value={index} label={range.label} key={index} />
    ));
  }, [isSuccess, selectedDay, values]);

  return (
    <HStack
      justifyContent={'space-around'}
      alignItems={'center'}
      space={isSuccess ? 0 : 4}>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
        <View flex={1}>
          <Picker
            style={Platform.select({ ios: {}, android: { height: 50 } })}
            selectedValue={selectedDay}
            onValueChange={v => {
              setSelectedRange(0);
              setSelectedDay(v);
            }}>
            {dayItems}
          </Picker>
        </View>
      </Skeleton>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
        <View flex={1}>
          <Picker
            style={Platform.select({ ios: {}, android: { height: 50 } })}
            selectedValue={selectedRange}
            onValueChange={setSelectedRange}>
            {slotItems}
          </Picker>
        </View>
      </Skeleton>
    </HStack>
  );
};

class TimingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSlot: {},
      closed: false,
      closesSoon: false,
      opensSoon: false,
      value: null,
      valid: true,
    };
  }

  showModal = show => this.props.showTimingModal(show);
  setValue = value => this.setState({ value });

  render() {
    return (
      <>
        {this.props.modalEnabled && (
          <BottomModal
            isVisible={this.props.timingModal}
            onBackdropPress={() => {
              this.showModal(false);
              this.props.onSkip();
            }}
            onBackButtonPress={() => {
              this.showModal(false);
              this.props.onSkip();
            }}>
            <Heading size={'sm'}>
              {this.props.t('CHECKOUT_SCHEDULE_ORDER')}
            </Heading>
            <Divider />
            {this.props.fulfillmentMethods.length > 1 && (
              <Button.Group
                isAttached
                mx={{
                  base: 'auto',
                  md: 0,
                }}
                size="sm">
                <Button
                  flex={1}
                  onPress={() =>
                    this.props.onFulfillmentMethodChange('delivery')
                  }
                  variant={
                    this.props.cartFulfillmentMethod === 'delivery'
                      ? 'solid'
                      : 'outline'
                  }>
                  {this.props.t('FULFILLMENT_METHOD.delivery')}
                </Button>
                <Button
                  flex={1}
                  onPress={() =>
                    this.props.onFulfillmentMethodChange('collection')
                  }
                  variant={
                    this.props.cartFulfillmentMethod === 'collection'
                      ? 'solid'
                      : 'outline'
                  }>
                  {this.props.t('FULFILLMENT_METHOD.collection')}
                </Button>
              </Button.Group>
            )}
            {this.props.message && (
              <Text marginBottom={50}>{this.props.message}</Text>
            )}
            {!this.props.message && <View marginBottom={30} />}
            <TimingCartSelect
              cart={this.props.cart}
              cartFulfillmentMethod={this.props.cartFulfillmentMethod}
              httpClient={this.props.httpClient}
              onValueChange={this.setValue}
            />
            <Button
              flex={4}
              onPress={() =>
                this.props.onSchedule({
                  value: this.state.value,
                  showModal: this.showModal,
                })
              }>
              {this.props.t('SCHEDULE')}
            </Button>
            <Button
              variant={'subtle'}
              onPress={() => {
                this.showModal(false);
                this.props.onSkip();
              }}>
              {this.props.t('IGNORE')}
            </Button>
          </BottomModal>
        )}
      </>
    );
  }
}

TimingModal.defaultProps = {
  modalEnabled: true,
  fulfillmentMethods: [],
  cartFulfillmentMethod: null,
  cart: null,
  onFulfillmentMethodChange: () => {},
  onSchedule: () => {},
  onSkip: () => {},
};

TimingModal.propTypes = {
  openingHoursSpecification: PropTypes.object.isRequired,
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  cartFulfillmentMethod: PropTypes.string,
  onFulfillmentMethodChange: PropTypes.func,
  cart: PropTypes.object,
  modalEnabled: PropTypes.bool,
  onSchedule: PropTypes.func,
  onSkip: PropTypes.func,
};

function mapStateToProps(state) {
  const { displayed, message } = state.checkout.timingModal;
  return {
    httpClient: selectHttpClient(state),
    timingModal: displayed,
    message,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showTimingModal: show => dispatch(showTimingModal(show)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TimingModal));
