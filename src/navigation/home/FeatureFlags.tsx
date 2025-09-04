import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSpinnerDelayEnabled,
  setBarcodeEnabled,
} from '../../redux/App/actions';
import {
  selectIsBarcodeEnabled,
  selectIsSpinnerDelayEnabled,
} from '../../redux/App/selectors';

export default function FeatureFlags() {
  const isSpinnerDelayEnabled = useSelector(selectIsSpinnerDelayEnabled);
  const isBarcodeEnabled = useSelector(selectIsBarcodeEnabled);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  return (
    <Box className="p-2">
      <Checkbox
        value="spinner delay"
        onChange={checked => dispatch(setSpinnerDelayEnabled(checked))}
        defaultIsChecked={isSpinnerDelayEnabled}>
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>{t('FEATURE_FLAG_SPINNER_DELAY')}</CheckboxLabel>
      </Checkbox>
      <Checkbox
        value="barcode"
        onChange={checked => dispatch(setBarcodeEnabled(checked))}
        defaultIsChecked={isBarcodeEnabled}>
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>{t('FEATURE_FLAG_BARCODE')}</CheckboxLabel>
      </Checkbox>
    </Box>
  );
}
