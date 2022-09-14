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

const tipColor = 'blueGray.200'
const pressedTipColor = 'blueGray.600'

const TipCart = props => <TouchableOpacity disabled={props.disabled} onPress={props.onPress}>
    <Avatar bg={props.bg} mr="1">
      {props.text}
    </Avatar>
  </TouchableOpacity>

class Tips extends Component {

  constructor(props) {
    super(props);
    const tip = props.order.adjustments.tip[0]?.amount || 0
    this.state = {
      tip,
      advancedView: !props.values.includes(tip),
    }
  }

  #setTipDebounce = _.debounce(tip => {
    this.props.setTip(this.props.order, tip)
  }, 350)

  setTip(tip, debounced = false) {
  if (this.state.tip === tip) {
      return
    }
    this.setState({ tip })
    if (debounced) {
      this.#setTipDebounce(tip)
    } else {
      this.props.setTip(this.props.order, tip)
    }
  }

  defaultView(values) {
    return values.map((value, index) => <TipCart
      key={index}
      text={formatPrice(value , { mantissa:0 })}
      onPress={() => this.setTip(value)}
      bg={this.state.tip === value ? pressedTipColor : tipColor} />)
  }

  render() {
    const { advancedView, tip } = this.state

    return <View padding={2}>
      <Heading size={'xs'}>{i18n.t('TIP')}</Heading>
      <HStack justifyContent="center">

        {!advancedView && this.defaultView(this.props.values)}

        {advancedView && <TipCart
          text={'-'}
          disabled={tip <= 0}
          onPress={() => this.setTip(tip - 100, true)}
          bg={tipColor} />}

        {advancedView && <TipCart
          disabled={true}
          text={formatPrice(tip, { mantissa: 0 })}
          bg={pressedTipColor} />}

        <TipCart
          text={'+'}
          onPress={() => {
            if (!this.state.advancedView) {
              return this.setState({ advancedView: true })
            }
            this.setTip(tip + 100, true)
          }}
          bg={tipColor} />
      </HStack>
    </View>
  }
}

Tips.defaultProps = {
  values: [ 0, 200, 300, 500 ],
}

Tips.propTypes = {
  order: PropTypes.object.isRequired,
  values: PropTypes.arrayOf(PropTypes.number),
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
