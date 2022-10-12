import { Dimensions, StyleSheet, View, useColorScheme } from 'react-native';
import { ScrollView, VStack } from 'native-base';
import Modal from 'react-native-modal';
import React from 'react';

const { height, width } = Dimensions.get('window')

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
  const colorScheme = useColorScheme()
  return <Modal
    testID={'modal'}
    deviceHeight={height}
    deviceWidth={width}
    useNativeDriver={true}
    useNativeDriverForBackdrop={true}
    hideModalContentWhileAnimating={true}
    style={styles.view}
    {...otherProps}
  >
    <View maxHeight={height * 0.7}>
      <ScrollView>
        <VStack style={styles.content}
                backgroundColor={colorScheme === 'dark' ? 'dark.100' : 'white'}
                space={3}
        >
        {children}
        </VStack>
      </ScrollView>
    </View>
  </Modal>
}
