import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

const Auth = require('./src/Auth');

class AccountPage extends Component {
  state = {
    username: undefined,
    email: undefined
  }
  componentDidMount() {
    Auth.getUser().then((user) => {
      this.setState({
        username: user.username,
        email: user.email
      });
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
  _onClickButton(navigator) {
    Auth.removeUser().then(() => {
      this.props.onLogout();
      navigator.parentNavigator.pop();
    });
  }
  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <View style={{padding: 10}}>
          <Text>{this.state.email}</Text>
        </View>
        <View style={{padding: 10}}>
          <Text>{this.state.username}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={this._onClickButton.bind(this, navigator)}>
          <Text style={{color: "white"}}>Déconnexion</Text>
        </TouchableOpacity>
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
          Mon compte
        </Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#246dd5",
  }
});

module.exports = AccountPage;