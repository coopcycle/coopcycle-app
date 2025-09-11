import {
  Button,
  ButtonText,
  ButtonGroup,
} from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavigationHolder from '../NavigationHolder';
import Markdown from './Markdown';

class LegalText extends Component {
  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();

    this._handleNav = this._handleNav.bind(this);
  }

  componentDidUpdate() {
    this.scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
  }

  _handleNav({ legalTextAccepted }) {
    this.props.dispatchAccept(legalTextAccepted);
    NavigationHolder.goBack();
  }

  render() {
    if (this.props.loading) {
      return (
        <Center flex={1}>
          <Spinner size="large" />
        </Center>
      );
    }

    return (
      <SafeAreaView>
        <ScrollView
          ref={this.scrollRef}
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: '100%' }}
          px="4">
          <Box className="p-4">
            <Markdown>{this.props.text}</Markdown>
            {this.props.showConfirmationButtons && (
              <ButtonGroup flexDirection="row" className="py-4">
                <Button
                  variant="outline"
                  className="w-1/2"
                  onPress={() => this._handleNav({ legalTextAccepted: false })}>
                  <ButtonText>{this.props.t('CANCEL')}</ButtonText>
                </Button>
                <Button
                  action="positive"
                  className="w-1/2"
                  onPress={() => this._handleNav({ legalTextAccepted: true })}>
                  <ButtonText>{this.props.t('AGREE')}</ButtonText>
                </Button>
              </ButtonGroup>
            )}
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(LegalText);
