import { Avatar, Button, HStack, Heading, View } from 'native-base';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { formatPrice } from '../../../utils/formatting';

const tipColor = 'blueGray.200';
const pressedTipColor = 'blueGray.600';

const TipCart = props => (
  <Pressable disabled={props.disabled} onPress={props.onPress}>
    <Avatar bg={props.bg} size={'md'} mr="1">
      {props.text}
    </Avatar>
  </Pressable>
);

function Tips(props) {
  const [tip, setTip] = useState(props.value);
  const [advancedView, setAdvancedView] = useState(!props.values.includes(tip));

  const defaultView = values => {
    return values.map((value, index) => (
      <TipCart
        key={index}
        text={formatPrice(value, { mantissa: 0 })}
        onPress={() => setTip(value)}
        bg={tip === value ? pressedTipColor : tipColor}
      />
    ));
  };

  return (
    <View padding={2}>
      <Heading size={'xs'}>{props.t('TIP')}</Heading>
      <HStack justifyContent="center" paddingBottom={5}>
        {!advancedView && defaultView(props.values)}

        {advancedView && (
          <TipCart
            text={'-'}
            disabled={tip <= 0}
            onPress={() => setTip(tip - 100, true)}
            bg={tipColor}
          />
        )}

        {advancedView && (
          <TipCart
            disabled={true}
            text={formatPrice(tip, { mantissa: 0 })}
            bg={pressedTipColor}
          />
        )}

        <TipCart
          text={'+'}
          onPress={() => {
            if (!advancedView) {
              return setAdvancedView(true);
            }
            setTip(tip + 100, true);
          }}
          bg={tipColor}
        />
      </HStack>
      <Button onPress={() => props.onTip(tip)}>{props.t('VALIDATE')}</Button>
    </View>
  );
}

Tips.defaultProps = {
  value: 0,
  values: [0, 100, 200, 400],
};

Tips.propTypes = {
  onTip: PropTypes.func.isRequired,
  value: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
};

export default withTranslation()(Tips);
