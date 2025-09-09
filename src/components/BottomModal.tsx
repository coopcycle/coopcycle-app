import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    padding: 18,
    borderTopStartRadius: 6,
    borderTopRightRadius: 6,
  },
});

export default ({ children, ...otherProps }) => {
  const colorScheme = useColorScheme();
  return (
    <Modal
      testID={'modal'}
      deviceHeight={height}
      deviceWidth={width}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      style={styles.view}
      {...otherProps}>
      <View maxHeight={height * 0.7}>
        <ScrollView>
          <VStack
            style={styles.content}
            className={colorScheme === 'dark' ? 'bg-background-dark' : 'bg-background-light'}
            space="sm">
            {children}
          </VStack>
        </ScrollView>
      </View>
    </Modal>
  );
};
