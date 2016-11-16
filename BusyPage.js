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

const Auth = require('./src/Auth');

class BusyPage extends Component {
  // state = {
  //   email: undefined,
  //   password: undefined,
  //   message: undefined,
  // }
  constructor(props) {
    console.log(props.order);
    super(props);
    // this.state = {
    //   region: {
    //     ...COURIER_COORDS,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA,
    //   },
    //   polylineCoords: [],
    //   markers: [],
    //   position: undefined,
    //   loading: false,
    //   loadingMessage: 'Connexion au serveur…',
    //   order: undefined,
    // };
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
      <View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <View style={{alignItems: "center"}}>
          <Text>Vous étiez en train de livrer la commande :</Text>
          <Text>{this.props.order.restaurant.name}</Text>
          <Text>{this.props.order.restaurant.streetAddress}</Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <View style={styles.buttonGreen}>
            <TouchableOpacity onPress={() => {
              this.props.onContinue(this.props.order);
              navigator.parentNavigator.pop();
            }}>
              <Text style={{color: 'white'}}>Oui</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRed}>
            <TouchableOpacity>
              <Text style={{color: 'white'}}>Non</Text>
            </TouchableOpacity>
          </View>
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
  buttonGreen: {
    alignItems: "center",
    padding: 20,
    margin: 20,
    borderRadius: 4,
    backgroundColor: "#2ecc71",
  },
  buttonRed: {
    alignItems: "center",
    padding: 20,
    margin: 20,
    borderRadius: 4,
    backgroundColor: "#e74c3c",
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

module.exports = BusyPage;