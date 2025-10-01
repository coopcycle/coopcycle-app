import { Text } from '@/components/ui/text';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function FullScreenLoadingIndicator(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#c7c7c7" />
      {__DEV__ ? <Text>{props.debugHint}</Text> : null}
    </View>
  );
}
