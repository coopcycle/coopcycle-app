import React, {Component} from 'react';
import {Button, Text} from 'native-base';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {onboarded} from '../../redux/App/actions';

class CustomOnboarding extends Component {
  render() {
    const { width } = Dimensions.get('window')

    return (
      <View style={ styles.container }>
        <Image
          style={{ position: 'absolute', top: 0, right: 0, left: 0, width: width, height: (width / 2.25) }}
          source={require('../../assets/images/home-bg.png')} />
        <View style={{ paddingHorizontal: '10%', width: '100%' }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={ [ styles.disclaimerText, { fontWeight: 'bold', fontSize: 18 } ] }>
              { this.props.t('WELCOME') }
            </Text>
            <Text style={ styles.disclaimerText }>
              { this.props.t('WELCOME_TEXT') }
            </Text>
          </View>
          <View>
            <View>
              <Button onPress={ _ => this.props.onboarded() } testID="continueOnboard">
                { this.props.t('CONTINUE') }
              </Button>
            </View>
          </View>
        </View>
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
    marginBottom: 5,
  },
})


function mapStateToProps(state) {

  return {
  }
}

function mapDispatchToProps(dispatch) {

  return {
    onboarded: () => dispatch(onboarded()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CustomOnboarding))
