import { Avatar } from 'native-base';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
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

function Tips({ onTip, value = 0, values = [0, 100, 200, 400] }) {
  const [tip, setTip] = useState(value);
  const [advancedView, setAdvancedView] = useState(!values.includes(tip));
  const { t } = useTranslation();

  const defaultView = () => {
    return values.map((val, index) => (
      <TipCart
        key={index}
        text={formatPrice(val, { mantissa: 0 })}
        onPress={() => setTip(val)}
        bg={tip === val ? pressedTipColor : tipColor}
      />
    ));
  };

  return (
    <Box className="p-2">
      <Heading size="sm" className="mb-2 text-center">{t('TIP')}</Heading>
      <HStack className="justify-center pb-5">
        {!advancedView && defaultView()}

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
      <Button onPress={() => onTip(tip)}>
        <ButtonText>{t('VALIDATE')}</ButtonText>
      </Button>
    </Box>
  );
}

Tips.propTypes = {
  onTip: PropTypes.func.isRequired,
  value: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
};

export default Tips;
