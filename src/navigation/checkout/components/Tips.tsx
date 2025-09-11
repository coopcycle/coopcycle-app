import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatPrice } from '../../../utils/formatting';

const tipColor = 'blueGray.200';
const pressedTipColor = 'blueGray.600';

const TipCart = props => (
  <Button bg={props.bg} size={'md'} mr="1" onPress={props.onPress}  disabled={props.disabled}>
    <ButtonText>{props.text}</ButtonText>
  </Button>
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
      <ButtonGroup flexDirection="row" className="justify-between pb-5">
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
      </ButtonGroup>
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
