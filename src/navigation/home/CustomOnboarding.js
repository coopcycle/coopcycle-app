import React, { Component } from 'react';
import { Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { onboarded } from '../../redux/App/actions';
import Config from 'react-native-config';

const onboardingParams = {
  'https://naofood.coopcycle.org': {
    backgroundImage: '../../assets/images/naofood.png',
    text: `Hello :D
Bienvenue sur l’application Naofood !

Nous sommes sur la version Beta Test, vous pouvez donc nous faire tous les retours que vous jugerez utiles sur contact@naofood.fr.
Comme depuis le début de l’aventure, on adore avancer avec vous et lire vos retours.
Alors ne soyez pas timides !

On espère que l'expérience sera au top !
Nous vous tiendrons au courant des mises à jour de l’application.

Amusez-vous bien !`
  }
}

class CustomOnboarding extends Component {
  render() {
    const { width } = Dimensions.get('window')

    const imgSource = this.props.customBuild && onboardingParams.hasOwnProperty(Config.DEFAULT_SERVER) ?
      onboardingParams[Config.DEFAULT_SERVER].backgroundImage : '../../assets/images/home-bg.png'

    const text = this.props.customBuild && onboardingParams.hasOwnProperty(Config.DEFAULT_SERVER) ?
      onboardingParams[Config.DEFAULT_SERVER].text : 'Lorem ipsum'

    return (
      <View style={ styles.container }>
        <Image
          style={{ width: width, height: (width / 2.25) }}
          source={ require(imgSource) } />
        <ScrollView contentContainerStyle={{ marginHorizontal: '10%' }}>
            <Text style={ styles.disclaimerText }>{ text }</Text>
          <View>
            <Button size={'md'} onPress={ _ => this.props.onboarded() } testID="continueOnboard">
              { this.props.t('CONTINUE') }
            </Button>
          </View>
        </ScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    marginBottom: 5,
  },
  disclaimerText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
})


function mapStateToProps(state) {

  return {
    customBuild: state.app.customBuild,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    onboarded: () => dispatch(onboarded()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CustomOnboarding))
