import { Box, HStack, Text, VStack, View } from 'native-base';
import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { greenColor, greyColor, redColor } from '../../../styles/common';
import PropTypes from 'prop-types';

class  Step extends Component {

  render() {
    const { active, loading, error, hide, start, errorLabel, activeLabel, loadingLabel } = this.props
    const label = error ? errorLabel : active ? activeLabel : loadingLabel
    if (hide){
      return <View />
    }

    return <HStack>
      <VStack>
        {!start && <Box style={{ ...styles.line, ...(active ? styles.active : {}), ...(loading ? styles.loading : {}) }}/>}
        <Box style={{ ...styles.dot, ...(active ? styles.active : {}), ...(error ? styles.error : {}) }} />
      </VStack>
      <View style={{ ...styles.labelContainer }}>
        <Text style={{ ...styles.label }}>{label}</Text>
        {loading && <ActivityIndicator size={'small'} style={{ height: 16 }} />}
      </View>
    </HStack>
  }
}

Step.defaultProps = {
  start: false,
  active: false,
  loading: false,
  error: false,
  hide: false,
  activeLabel: '',
  loadingLabel: '',
  errorLabel: '',
}

Step.propTypes = {
  start: PropTypes.bool,
  active: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  hide: PropTypes.bool,
  activeLabel: PropTypes.string,
  loadingLabel: PropTypes.string,
  errorLabel: PropTypes.string,
}
const styles = StyleSheet.create({
  dot: {
    width: 16,
    height: 16,
    backgroundColor: greyColor,
    borderRadius: 20,
  },
  line: {
    width: 1,
    marginLeft: 7,
    height: 35,
    borderColor: greyColor,
    borderWidth: 1,
  },
  active: {
    borderColor: greenColor,
    backgroundColor: greenColor,
  },
  error: {
    borderColor: redColor,
    backgroundColor: redColor,
  },
  loading: {
    borderColor: greenColor + '66',
    backgroundColor: greenColor + '66',
  },
  label: {
    paddingStart: 14,
    paddingEnd: 5,
    lineHeight: 16,
  },
  labelContainer: {
    flex:1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
})

export default Step
