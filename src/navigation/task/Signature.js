import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, VStack } from 'native-base';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import SignatureScreen from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';
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
    const path = FileSystem.cacheDirectory + v4() + '.jpg';
    base64 = base64.replace('data:image/jpeg;base64,', '');
    FileSystem.writeAsStringAsync(path, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      const task = this.props.route.params?.task;
      const tasks = this.props.route.params?.tasks;
      this.props.addSignature(task, path);
      this.props.navigation.navigate({
        name: 'TaskCompleteHome',
        params: { task, tasks },
        merge: true,
      });
    });
  }

  _clearCanvas() {
    this.signatureRef.current?.clearSignature();
  }

  render() {
    return (
      <VStack flex={1}>
        <VStack flex={1} p="2">
          <Text note style={{ textAlign: 'center', marginBottom: 20 }}>
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
            {this.props.t('SIGNATURE_CLEAR')}
          </Button>
        </VStack>
        <VStack p="2">
          <Button size="lg" onPress={this._saveImage.bind(this)}>
            {this.props.t('SIGNATURE_ADD')}
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
