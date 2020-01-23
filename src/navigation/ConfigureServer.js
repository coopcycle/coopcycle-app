import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  View,
  StyleSheet,
} from 'react-native'
import {
  Container, Content,
  Button, Text,
} from 'native-base'
import { withTranslation } from 'react-i18next'

class ConfigureServer extends Component {

  render() {

    const { width } = Dimensions.get('window')

    return (
      <Container>
        <Content scrollEnabled={ false } contentContainerStyle={{ flex: 1 }}>
          <Image
            style={{ width: width, height: (width / 3.58) }}
            source={require('../assets/images/home-bg.png')} />
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={ [ styles.disclaimerText, { fontWeight: 'bold' } ] }>{`${this.props.t('WELCOME')} !`}</Text>
              <Text style={ styles.disclaimerText }>{ this.props.t('ALPHA_DISCLAIMER') }</Text>
              <Text style={ styles.disclaimerText }>{ this.props.t('UPDATE_REMINDER') }</Text>
            </View>
            <View>
              <View>
                <Button block bordered onPress={ _ => this.props.navigation.navigate('HomeChooseCity') } testID="chooseCityBtn" accessible={true} accessibilityLabel="chooseCityBtn">
                  <Text>{ this.props.t('CHOOSE_CITY') }</Text>
                </Button>
              </View>
              <View style={{ paddingVertical: 10 }}>
                <Text note style={{ textAlign: 'center' }}>
                  { this.props.t('CHOOSE_SERVER') }
                </Text>
              </View>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
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

module.exports = withTranslation()(ConfigureServer)
