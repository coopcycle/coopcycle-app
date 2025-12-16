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
  setBarcodeEnabled,
} from '../../redux/App/actions';
import {
  selectIsBarcodeEnabled,
} from '../../redux/App/selectors';

export default function FeatureFlags() {
  const isBarcodeEnabled = useSelector(selectIsBarcodeEnabled);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  return (
    <Box className="p-2">
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
