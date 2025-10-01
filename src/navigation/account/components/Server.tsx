import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { resetServer } from '../../../redux/App/actions';

class Server extends Component {
  render() {
    return (
      <Box className="p-2">
        <Text style={{ textAlign: 'center' }}>
          {[
            this.props.t('CONNECTED_TO'),
            ' ',
            <Text key={3} style={{ fontWeight: 'bold' }}>
              {this.props.baseURL}
            </Text>,
          ]}
        </Text>
        <Button
          size="sm"
          variant="link"
          onPress={() => this.props.resetServer()}>
          <ButtonText>{this.props.t('CHANGE_SERVER')}</ButtonText>
        </Button>
      </Box>
    );
  }
}

function mapStateToProps(state) {
  return {
    baseURL: state.app.baseURL,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetServer: () => dispatch(resetServer()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Server));
