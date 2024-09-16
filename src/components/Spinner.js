import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector } from 'react-redux';

import { selectIsLoading } from '../redux/App/selectors';

export default function SpinnerWrapper() {
  const isLoading = useSelector(selectIsLoading);

  return <Spinner visible={isLoading} />;
}
