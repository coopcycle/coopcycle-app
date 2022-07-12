import { Animated, ImageBackground, StyleSheet, View } from 'react-native';
import { HStack, Icon, IconButton, Text } from 'native-base';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    color: '#ffffff',
    fontFamily: 'Raleway-Regular',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
export default (props) => {
  return <Animated.View style={{
    width: '100%',
    height: '100%',
  }}>
    <ImageBackground source={{ uri: props.image }} style={{ width: '100%', height: '100%' }}>
      <HStack style={ styles.overlay }>
        <View style={{ height: 60, justifyContent: 'center' }}>
          <Text style={ styles.restaurantName } numberOfLines={ 1 }>{ props.text }</Text>
        </View>
        {props.onInfo && <IconButton onPress={props.onInfo} _icon={{ as: FontAwesome5, name: 'info-circle', size: 'xs', color:'white' }} />}
      </HStack>
    </ImageBackground>
  </Animated.View>
}
