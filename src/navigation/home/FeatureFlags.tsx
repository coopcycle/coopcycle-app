import { Checkbox, Column } from 'native-base';
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
    <Column m={4}>
      <Checkbox
        accessibilityLabel="configure spinner delay"
        value="spinner delay"
        onChange={checked => dispatch(setSpinnerDelayEnabled(checked))}
        defaultIsChecked={isSpinnerDelayEnabled}>
        {t('FEATURE_FLAG_SPINNER_DELAY')}
      </Checkbox>
      <Checkbox
        accessibilityLabel="configure barcode"
        value="barcode"
        onChange={checked => dispatch(setBarcodeEnabled(checked))}
        defaultIsChecked={isBarcodeEnabled}>
        {t('FEATURE_FLAG_BARCODE')}
      </Checkbox>
    </Column>
  );
}
