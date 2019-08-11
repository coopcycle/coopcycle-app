import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, Button, Icon, Text,
  Label, Item, Input
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

class AccountDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      email: null,
      username: null
    };
  }
  componentDidMount() {
    this.props.httpClient.get('/api/me')
      .then(data => {
        const { email, username } = data
        this.setState({
          loading: false,
          email,
          username,
        })
      });
  }
  render() {

    const { email, username } = this.state

    let loader = (
      <View />
    )
    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
        </View>
      );
    }

    return (
      <Container>
        <Content style={{ paddingHorizontal: 10, paddingTop: 20 }}>
          { username && (<Item stackedLabel disabled>
            <Label>{this.props.t('USERNAME')}</Label>
            <Input disabled placeholder={ username } />
            <Icon name="information-circle" />
          </Item> )}
          { email && (<Item stackedLabel disabled>
            <Label>{this.props.t('EMAIL')}</Label>
            <Input disabled placeholder={ email } />
            <Icon name="information-circle" />
          </Item> )}
        </Content>
        { loader }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
});

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient
  }
}

module.exports = connect(mapStateToProps)(withTranslation()(AccountDetailsPage))
