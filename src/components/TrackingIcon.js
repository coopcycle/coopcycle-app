import { Icon } from 'native-base';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    enabled: state.app.isBackgroundGeolocationEnabled,
  };
}

const TrackingIcon = ({ enabled }) => (
  <Icon
    as={Ionicons}
    name="navigate"
    style={{ color: enabled ? 'green' : 'lightgrey' }}
  />
);

export default connect(mapStateToProps)(TrackingIcon);
