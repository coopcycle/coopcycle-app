import React, { Component } from 'react';
import OpeningHoursSpecification from '../../../utils/OpeningHoursSpecification';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';
import FocusHandler from '../../../components/FocusHandler';

class TimingModal extends Component{

  constructor(props) {
    super(props);
    const { openingHoursSpecification } = props.restaurant

    this.ohs = new OpeningHoursSpecification()
    this.ohs.openingHours = openingHoursSpecification

    this.state = {
      timeSlot: {},
      closed: false,
      closesSoon: false,
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const currentTimeSlot = this.ohs.currentTimeSlot
    if (this.state.closed && !prevState.closed) {
      this.props.onClose(currentTimeSlot)
    }

    if (!this.state.closed && prevState.closed) {
      this.props.onOpen(currentTimeSlot)
    }

    if (this.state.closesSoon && !prevState.closesSoon) {
      this.props.onClosesSoon(currentTimeSlot)
    }
  }

  refreshState() {
    const timeSlot = this.ohs.currentTimeSlot
    const closed = timeSlot.state === OpeningHoursSpecification.STATE.Closed
    const closesSoon = OpeningHoursSpecification.closesSoon(timeSlot.timeSlot, 15, moment('09-19-2022 22:05'))

    this.setState({
      timeSlot,
      closed,
      closesSoon,
    })

  }

  componentDidMount() {
    this.refreshState()
  }

  render = () => <FocusHandler
    onFocus={() => setInterval(() => this.refreshState(), 15_000)}
    onBlur={data => clearInterval(data)}
  />
}

TimingModal.defaultProps = {
  onClosesSoon: () => {},
  onOpensSoon: () => {},
  onClose: () => {},
  onOpen: () => {},
}


TimingModal.propTypes = {
  restaurant: PropTypes.object.isRequired,
  onClosesSoon: PropTypes.func,
  onOpensSoon: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TimingModal))
