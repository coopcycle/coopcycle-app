import { Checkbox, Column } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setSpinnerDelayEnabled, setIncidentEnabled } from '../../redux/App/actions';
import { selectIsSpinnerDelayEnabled, selectIsIncidentEnabled } from '../../redux/App/selectors';

export default function FeatureFlags() {
  const isSpinnerDelayEnabled = useSelector(selectIsSpinnerDelayEnabled);
  const isIncidentEnabled = useSelector(selectIsIncidentEnabled);

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
        accessibilityLabel="configure incident"
        onChange={checked => dispatch(setIncidentEnabled(checked))}
        defaultIsChecked={isIncidentEnabled}
        value="incident">
      {t('FEATURE_FLAG_ENABLE_INCIDENT')}
      </Checkbox>
    </Column>
  );
}
