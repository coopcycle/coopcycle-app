import { useFocusEffect } from '@react-navigation/native'
import React from 'react'

// https://reactnavigation.org/docs/function-after-focusing-screen/
export default function FocusHandler(props) {
  useFocusEffect(
    React.useCallback(() => {
      const data = props.onFocus()
      return () => props.onBlur(data);
    }, [props])
  );
  return null
}
