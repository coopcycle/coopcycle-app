import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class LoginPage extends Component {
  _responseInfoCallback(error, result) {
    // if (error) {
    //   console.log('Error fetching data: ' + error.toString());
    // } else {
    //   console.log('Success fetching data: ' + result.toString());
    // }
    console.log(result);
  }
  _onLoginFinished(error, result) {
    if (error) {
      alert("Login failed with error: " + result.error);
    } else if (result.isCancelled) {
      alert("Login was cancelled");
    } else {
      AccessToken.getCurrentAccessToken().then((data) => {
          console.log(data.accessToken.toString());
          let config = {
            httpMethod: 'GET',
            parameters: {},
            accessToken: data.accessToken.toString(),
          }
          let request = new GraphRequest('/me', config, this._responseInfoCallback);
          request.addStringParameter('id,email,first_name,last_name', 'fields');

          new GraphRequestManager().addRequest(request).start();
        }
      );
    }
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <LoginButton
            onLoginFinished={this._onLoginFinished.bind(this)}
            onLogoutFinished={() => console.log("User logged out")}/>
      </View>
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>Retour</Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Coursiers
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = LoginPage;