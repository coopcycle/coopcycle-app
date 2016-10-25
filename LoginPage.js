import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
} from 'react-native';

// const FBSDK = require('react-native-fbsdk');
// const {
//   LoginButton,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } = FBSDK;

const Auth = require('./src/Auth');

class LoginPage extends Component {
  state = {
    email: undefined,
    password: undefined,
    message: undefined,
  }
  _onSubmit(navigator) {
    Auth.login(this.state.email, this.state.password)
      .then((user) => {
        navigator.parentNavigator.pop();
        this.props.onLoginSuccess(user);
      })
      .catch((err) => {
        if (err.code === 401) {
          this.setState({message: "Utilisateur et/ou mot de passe inexistant."})
        }
      });
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
      <View style={{flex: 1, flexDirection: "column", justifyContent: "center", padding: 10}}>
        <View style={styles.email}>
          <TextInput
            ref="email"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(email) => this.setState({email})}
            style={{height: 40}}
            placeholder="Email"
          />
        </View>
        <View style={styles.password}>
          <TextInput
            ref="password"
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})}
            style={{height: 40}}
            placeholder="Mot de passe"
          />
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={this._onSubmit.bind(this, navigator)}>
            <Text style={{color: "white", fontWeight: "bold"}}>Valider</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.message}>
          <Text>{this.state.message}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  email: {
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8e8e8e',
  },
  password: {
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8e8e8e',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#246dd5",
    padding: 20,
    marginTop: 20,
    borderRadius: 4
  },
  message: {
    alignItems: "center",
    padding: 20,
  }
});

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
          Connexion
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = LoginPage;