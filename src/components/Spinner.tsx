import React from 'react';
import { connect } from 'react-redux';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import {
  selectIsLoading,
} from '../redux/App/selectors';

const Spinner = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

function mapStateToProps(state) {
  return {
    isLoading: selectIsLoading(state),
  };
}

export default connect(mapStateToProps)(Spinner);
