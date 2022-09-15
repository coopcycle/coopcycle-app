import { Avatar, HStack, Heading, View } from 'native-base';
import React, { Component } from 'react';
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
      tip: 0,
      advancedView: false,
    }
  }

  setTipDebounce = _.debounce(tip => {
    this.props.setTip(this.props.order, tip)
  }, 500)

  setTip = tip => {
    if (this.state.tip === tip) {
      return
    }
    this.setState({ tip })
    this.setTipDebounce(tip)
  }

  render() {
    const { advancedView, tip } = this.state
    const tipAmount = this.props.order.adjustments.tip[0]?.amount || 0

    return <View padding={2}>
      <Heading size={'xs'}>{i18n.t('TIP')}</Heading>
      <HStack justifyContent="center">

        {!advancedView && <TipCart
          text={formatPrice(0 , { mantissa:0 })}
          onPress={() => this.setTip(0)}
          bg={tipAmount === 0 ? 'blueGray.600' : 'blueGray.200'} />}

        {!advancedView && <TipCart
          text={formatPrice(200 , { mantissa:0 })}
          onPress={() => this.setTip(200)}
          bg={tipAmount === 200 ? 'blueGray.600' : 'blueGray.200'} />}

        {!advancedView && <TipCart
          text={formatPrice(300 , { mantissa:0 })}
          onPress={() => this.setTip(300)}
          bg={tipAmount === 300 ? 'blueGray.600' : 'blueGray.200'} />}

        {!advancedView && <TipCart
          text={formatPrice(500 , { mantissa:0 })}
          onPress={() => this.setTip(500)}
          bg={tipAmount === 500 ? 'blueGray.600' : 'blueGray.200'} />}

        {advancedView && <TipCart
          text={'-'}
          onPress={() => {
            if (tip <= 0) {
              return this.setTip(0)
            }
            return this.setTip(tip - 100)
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
            this.setTip(tip + 100)
          }}
          bg={'blueGray.200'} />
      </HStack>
    </View>
  }
}

Tips.propTypes = {
  order: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setTip: (order, amount) => dispatch(setTip(order, amount)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Tips))
