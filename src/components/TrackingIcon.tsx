import { Icon } from '@/components/ui/icon';
import React from 'react';
import { Navigation } from 'lucide-react-native';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    enabled: state.app.isBackgroundGeolocationEnabled,
  };
}

const TrackingIcon = ({ enabled }) => (
  <Icon
    as={Navigation}
    style={{ color: enabled ? 'green' : 'lightgrey' }}
  />
);

export default connect(mapStateToProps)(TrackingIcon);
