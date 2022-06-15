import {Animated, ImageBackground, StyleSheet, View} from 'react-native';
import {Text} from 'native-base';
import React from 'react';
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
  },
});
export default (props) => {
  return <Animated.View style={{
    width: '100%',
    height: '100%',
  }}>
    <ImageBackground source={{ uri: props.image }} style={{ width: '100%', height: '100%' }}>
      <View style={ styles.overlay }>
        <View style={{ height: 60, justifyContent: 'center' }}>
          <Text style={ styles.restaurantName } numberOfLines={ 1 }>{ props.text }</Text>
        </View>
      </View>
    </ImageBackground>
  </Animated.View>
}
