import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'native-base'

function mapStateToProps(state) {

  return {
    enabled: state.app.isBackgroundGeolocationEnabled,
  }
}

const TrackingIcon = ({ enabled }) => (
  <Icon name="navigate" style={{ color: enabled ? 'green' : 'lightgrey' }}/>
)

export default connect(mapStateToProps)(TrackingIcon)
