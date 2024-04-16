import { Center, FormControl, Input } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';

import { loadPersonalInfo } from '../../redux/Account/actions';

class AccountDetailsPage extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadPersonalInfo();
    });
  }

  render() {
    const { email, username } = this.props;

    return (
      <Center flex={1} px="2">
        {username ? (
          <FormControl disabled>
            <FormControl.Label>{this.props.t('USERNAME')}</FormControl.Label>
            <Input disabled placeholder={username} />
          </FormControl>
        ) : null}
        {email ? (
          <FormControl disabled>
            <FormControl.Label>{this.props.t('EMAIL')}</FormControl.Label>
            <Input disabled placeholder={email} />
          </FormControl>
        ) : null}
      </Center>
    );
  }
}

function mapStateToProps(state) {
  return {
    email: state.account.email,
    username: state.account.username,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPersonalInfo: () => dispatch(loadPersonalInfo()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AccountDetailsPage));
