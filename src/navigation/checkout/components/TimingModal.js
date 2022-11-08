import React, { Component, useEffect, useMemo, useState } from 'react';
import OpeningHoursSpecification from '../../../utils/OpeningHoursSpecification';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FocusHandler from '../../../components/FocusHandler';
import BottomModal from '../../../components/BottomModal';
import { Button, Divider, HStack, Heading, Skeleton, Text, View } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { useQuery } from 'react-query';
import { selectHttpClient } from '../../../redux/App/selectors';
import { groupBy, map, reduce } from 'lodash';
import moment from 'moment';
import { showTimingModal } from '../../../redux/Checkout/actions';
import { InteractionManager } from 'react-native';
import { t } from 'i18next';


const TimingCartSelect = ({ cart: { cart, token }, httpClient, onValueChange }) => {

  httpClient = httpClient.cloneWithToken(token)
  const { data, isSuccess } = useQuery([ 'cart', 'timing', cart['@id'] ], async () => {
    return await httpClient.get(`${cart['@id']}/timing`)
  })

  const values = useMemo(() => {
    if (!isSuccess)
      {return null}
    return reduce(groupBy(data.ranges, (d) => moment(d[0]).startOf('day').format()),
      (acc, day, index) => {
        acc.push({
          day: moment(index),
          values: map(day, (range) => ({
            value: range,
            label: `${moment(range[0]).format('LT')} - ${moment(range[1]).format('LT')}`,
          })),
        })
        return acc
      }, [])
  }, [ data, isSuccess ])

  const [ selectedDay, setSelectedDay ] = useState(0)
  const [ selectedRange, setSelectedRange ] = useState(0)

  useEffect(() => {
    if (isSuccess) {
      onValueChange(values[selectedDay].values[selectedRange].value)
    }
  }, [ selectedDay, selectedRange, values, isSuccess ])

  return <HStack justifyContent={'space-around'} alignItems={'center'} space={isSuccess ? 0 : 4}>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
        <View flex={1}>
        <Picker style={{ height: 50 }}
              selectedValue={selectedDay}
              onValueChange={(v) => {
                setSelectedDay(v)
                setSelectedRange(0)
              }}
      >
          {isSuccess && values.map((day, index) =>
            <Picker.Item value={index} label={day.day.format('ddd DD MMMM')} key={index} />
          )}
        </Picker></View></Skeleton>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
      <View flex={1}>
        <Picker style={{ height: 50 }}
              selectedValue={selectedRange}
              onValueChange={setSelectedRange}
      >
          {isSuccess && values[selectedDay].values.map((range, index) =>
            <Picker.Item value={index} label={range.label} key={index} />
          )}
        </Picker></View></Skeleton>
  </HStack>
}

class TimingModal extends Component{

  constructor(props) {
    super(props);

    this.state = {
      timeSlot: {},
      closed: false,
      closesSoon: false,
      opensSoon: false,
      value: null,
      valid: true,
    }
  }
  showModal = show => this.props.showTimingModal(show)
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const timeSlot = this.props.openingHoursSpecification.currentTimeSlot
    const { showModal } = this
    if (this.state.closed && !prevState.closed) {
      this.props.onClose({ timeSlot, showModal })
    }

    if (!this.state.closed && prevState.closed) {
      this.props.onOpen({ timeSlot })
    }

    if (this.state.closesSoon && !prevState.closesSoon) {
      this.props.onClosesSoon({ timeSlot, showModal })
    }

    if (this.state.opensSoon && !prevState.opensSoon) {
      this.props.onOpensSoon({ timeSlot, showModal })
    }
  }

  refreshState() {
    const timeSlot = this.props.openingHoursSpecification.currentTimeSlot
    const closed = timeSlot.state === OpeningHoursSpecification.STATE.Closed
    const closesSoon = OpeningHoursSpecification.closesSoon(timeSlot.timeSlot)
    const opensSoon = OpeningHoursSpecification.opensSoon(timeSlot.timeSlot)

    this.props.onRefresh({
      timeSlot,
      moment: moment(),
      openingHoursSpecification: this.props.openingHoursSpecification,
      cart: this.props.cart,
      showModal: this.showModal,
    })

    this.setState({
      timeSlot,
      closed,
      closesSoon,
      opensSoon,
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshState()
    })
  }

  render = () => <>
    <FocusHandler
    onFocus={() => setInterval(() => this.refreshState(), 15_000)}
    onBlur={data => clearInterval(data)}
  />
    {this.props.modalEnabled && <BottomModal
      isVisible={this.props.timingModal}
      onBackdropPress={() => this.showModal(false)}
      onBackButtonPress={() => this.showModal(false)}
    >
      <Heading size={'sm'}>{t('CHECKOUT_SCHEDULE_ORDER')}</Heading>
      <Divider />
      {this.props.message && <Text marginBottom={50}>{this.props.message}</Text>}
      {!this.props.message && <View marginBottom={30} />}
      <TimingCartSelect cart={this.props.cart}
                     httpClient={this.props.httpClient}
                     onValueChange={(value) => this.setState({ value })}
      />
        <Button flex={4} colorScheme={'orange'}
              onPress={() => this.props.onSchedule({
                value: this.state.value,
                showModal: this.showModal,
              })}
      >{t('SCHEDULE')}</Button>
      <Button colorScheme={'orange'} variant={'subtle'}
              onPress={() => this.showModal(false)}
      >{t('IGNORE')}</Button>
    </BottomModal>}
    </>
}

TimingModal.defaultProps = {
  modalEnabled: true,
  cart: null,
  onClosesSoon: () => {},
  onOpensSoon: () => {},
  onClose: () => {},
  onOpen: () => {},
  onSchedule: () => {},
  onRefresh: () => {},
}


TimingModal.propTypes = {
  openingHoursSpecification: PropTypes.object.isRequired,
  cart: PropTypes.object,
  modalEnabled: PropTypes.bool,
  onClosesSoon: PropTypes.func,
  onOpensSoon: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onSchedule: PropTypes.func,
  onRefresh: PropTypes.func,
}

function mapStateToProps(state) {
  const { displayed, message } = state.checkout.timingModal
  return {
    httpClient: selectHttpClient(state),
    timingModal: displayed,
    message,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showTimingModal: show => dispatch(showTimingModal(show)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TimingModal))
