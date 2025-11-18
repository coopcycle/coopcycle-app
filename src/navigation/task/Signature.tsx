import { File, Paths } from 'expo-file-system';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

import { addSignature } from '../../redux/Courier';

// Hide footer
// https://github.com/YanYuanFE/react-native-signature-canvas#basic-parameters
const signatureStyle = `
body,html {
  height: 100%;
}
.m-signature-pad {
  box-shadow: none;
  border: none;
}
.m-signature-pad--body {
  border: none;
}
.m-signature-pad--footer {
  display: none;
  margin: 0px;
}
`;

class Signature extends Component {
  constructor(props) {
    super(props);
    this.signatureRef = React.createRef();
  }

  _saveImage() {
    this.signatureRef.current?.readSignature();
  }

  handleOK(base64) {

    const filename = v4() + '.jpg';
    const file = new File(Paths.cache, filename);

    file.write(
      Uint8Array.from(atob(base64.replace('data:image/jpeg;base64,', '')), c => c.charCodeAt(0))
    );

    const task = this.props.route.params?.task;
    const tasks = this.props.route.params?.tasks;
    this.props.addSignature(task, file.uri);
    this.props.navigation.navigate({
      name: 'TaskCompleteHome',
      params: { task, tasks },
      merge: true,
    });
  }

  _clearCanvas() {
    this.signatureRef.current?.clearSignature();
  }

  render() {
    return (
      <VStack flex={1}>
        <VStack flex={1} className="p-2">
          <Text className="text-center mb-4">
            {this.props.t('SIGNATURE_DISCLAIMER')}
          </Text>
          <View style={styles.canvasContainer}>
            <SignatureScreen
              ref={this.signatureRef}
              imageType="image/jpeg"
              backgroundColor="rgba(255, 255, 255)"
              onOK={this.handleOK.bind(this)}
              webStyle={signatureStyle}
            />
          </View>
          <Button
            variant="outline"
            size="sm"
            onPress={this._clearCanvas.bind(this)}>
            <ButtonText>{this.props.t('SIGNATURE_CLEAR')}</ButtonText>
          </Button>
        </VStack>
        <VStack className="p-2">
          <Button size="lg" onPress={this._saveImage.bind(this)}>
            <ButtonText>{this.props.t('SIGNATURE_ADD')}</ButtonText>
          </Button>
        </VStack>
      </VStack>
    );
  }
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 1,
  },
});

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    addSignature: (task, base64) => dispatch(addSignature(task, base64)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Signature));
