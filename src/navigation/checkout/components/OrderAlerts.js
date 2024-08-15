import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import DangerAlert from '../../../components/DangerAlert';
import { selectViolations } from '../../../redux/Checkout/selectors';

export default function OrderAlerts() {
  const violations = useSelector(selectViolations);
  const alertMessage = _.first(violations.map(v => v.message));

  if (!alertMessage) {
    return null;
  }

  return <DangerAlert text={alertMessage} />;
}
