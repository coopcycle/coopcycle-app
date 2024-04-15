import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

import { localeDetector } from '../../i18n';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instance: null,
    };
  }

  componentDidMount() {
    axios
      .get('https://coopcycle.org/coopcycle.json')
      .then(response => {
        const instance = _.find(
          response.data,
          i => i.coopcycle_url === this.props.baseURL,
        );
        this.setState({ instance });
      })
      .catch(e => console.log(e));
  }

  renderText() {
    const { instance } = this.state;

    if (!instance.text) {
      return null;
    }

    const languages = _.keys(instance.text);

    if (languages.length === 0) {
      return null;
    }

    let text = '';
    if (languages.length === 1) {
      text = instance.text[languages[0]];
    } else {
      if (instance.text[this.props.language]) {
        text = instance.text[this.props.language];
      }
    }

    // Strip HTML
    text = text.replace(/(<([^>]+)>)/gi, '');

    return (
      <Text
        style={{ textAlign: 'center', paddingHorizontal: '10%', fontSize: 14 }}>
        {text}
      </Text>
    );
  }

  render() {
    const { instance } = this.state;

    if (!instance) {
      return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: '33.3333%', paddingVertical: 15 }}>
          <Text
            style={{ textAlign: 'center', marginBottom: 5, fontWeight: '700' }}>
            {this.props.t('ABOUT_INSTANCE', { name: instance.name })}
          </Text>
          <Text note style={{ textAlign: 'center', marginBottom: 10 }}>
            {instance.city}
          </Text>
          {this.props.logo && (
            <Image
              style={{ flex: 1, height: undefined, width: undefined }}
              source={{ uri: this.props.logo }}
            />
          )}
        </View>
        <ScrollView style={{ height: '66.6666%', marginVertical: 30 }}>
          {this.renderText()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    baseURL: state.app.baseURL,
    logo: state.app.settings.logo,
    language: localeDetector(),
  };
}

export default connect(mapStateToProps)(withTranslation()(About));
