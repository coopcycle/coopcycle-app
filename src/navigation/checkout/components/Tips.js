import { Avatar, HStack, Heading, View } from 'native-base';
import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { greenColor, greyColor, redColor } from '../../../styles/common';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { setTip } from '../../../redux/Checkout/actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatPrice } from '../../../utils/formatting';
import i18n from '../../../i18n';

const TipCart = (props) => {
  return <TouchableOpacity onPress={props.onPress}><Avatar bg={props.bg} mr="1">
    {props.text}
  </Avatar></TouchableOpacity>
}

class Tips extends Component {

  constructor() {
    super();
    this.state = {
      tip: 600,
      advancedView: false,
    }
  }


  render() {
    const tipAmount = this.props.order.adjustments.tip[0]?.amount || 0
    const { advancedView, tip } = this.state
    const debouncedSetTip = _.debounce(() => this.props.setTip(this.props.order, this.state.tip), 600)
    return <View padding={2}>
      <Heading size={'xs'}>{i18n.t('TIP')}</Heading>
      <HStack justifyContent="center">
        {!advancedView && <TipCart
          text={formatPrice(0 , { mantissa:0 })}
          onPress={() => this.props.setTip(this.props.order, 0)}
          bg={tipAmount === 0 ? 'blueGray.600' : 'blueGray.200'} />}
        {!advancedView && <TipCart
          text={formatPrice(200 , { mantissa:0 })}
          onPress={() => this.props.setTip(this.props.order, 200)}
          bg={tipAmount === 200 ? 'blueGray.600' : 'blueGray.200'} />}
        {!advancedView && <TipCart
          text={formatPrice(300 , { mantissa:0 })}
          onPress={() => this.props.setTip(this.props.order, 300)}
          bg={tipAmount === 300 ? 'blueGray.600' : 'blueGray.200'} />}
        {!advancedView && <TipCart
          text={formatPrice(500 , { mantissa:0 })}
          onPress={() => this.props.setTip(this.props.order, 500)}
          bg={tipAmount === 500 ? 'blueGray.600' : 'blueGray.200'} />}
        {advancedView && <TipCart
          text={'-'}
          onPress={() => {
            if (tip <= 0) {
              return this.setState({ tip: 0 })
            }
            this.setState({ tip: tip - 100 })
            debouncedSetTip()
          }}
          bg={'blueGray.200'} />}
        {advancedView && <TipCart
          text={formatPrice(tip, { mantissa: 0 })}
          bg={'blueGray.600'} />}
        <TipCart
          text={'+'}
          onPress={() => {
            if (!this.state.advancedView) {
              return this.setState({ advancedView: true })
            }
            this.setState({ tip: tip + 100 })
            debouncedSetTip()
          }}
          bg={'blueGray.200'} />
      </HStack>
    </View>
  }
}

Tips.defaultProps = {

}

Tips.propTypes = {
  order: PropTypes.object.isRequired,
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
function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setTip: (order, amount) => dispatch(setTip(order, amount)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Tips))
