import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Input, InputField } from '@/components/ui/input';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, View } from 'react-native';
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
      <Box className="flex-1 justify-center p-3">
        {username ? (
          <FormControl isDisabled className="mb-4">
            <FormControlLabel>
              <FormControlLabelText>{this.props.t('USERNAME')}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField isDisabled placeholder={username} />
            </Input>
          </FormControl>
        ) : null}
        {email ? (
          <FormControl isDisabled>
            <FormControlLabel>
              <FormControlLabelText>{this.props.t('EMAIL')}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField isDisabled placeholder={email} />
            </Input>
          </FormControl>
        ) : null}
      </Box>
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
