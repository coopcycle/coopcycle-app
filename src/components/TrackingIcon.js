import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
