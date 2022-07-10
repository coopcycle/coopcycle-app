import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button, HStack, Text, VStack,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

import { addSignature } from '../../redux/Courier'

class Signature extends Component {

  _saveImage() {
    const task = this.props.route.params?.task
    this._sketchCanvas.getBase64('jpg', false, true, true, true, (err, base64) => {
      if (!err) {
        this.props.addSignature(task, base64)
        this.props.navigation.navigate({ name: 'TaskCompleteHome', params: { task }, merge: true })
      }
    })
  }

  _clearCanvas() {
    this._sketchCanvas.clear()
  }

  render() {

    return (
      <VStack flex={ 1 }>
        <VStack flex={ 1 } p="2">
          <Text note style={{ textAlign: 'center', marginBottom: 20 }}>
            { this.props.t('SIGNATURE_DISCLAIMER') }
          </Text>
          <View style={ styles.canvasContainer }>
            <SketchCanvas
              ref={ component => { this._sketchCanvas = component } }
              style={{ flex: 1, backgroundColor: 'white' }}
              strokeColor={ 'black' }
              strokeWidth={ 7 } />
          </View>
          <Button light block onPress={ this._clearCanvas.bind(this) }>
            { this.props.t('SIGNATURE_CLEAR') }
          </Button>
        </VStack>
        <HStack p="2">
          <Button full onPress={ this._saveImage.bind(this) }>
            { this.props.t('SIGNATURE_ADD') }
          </Button>
        </HStack>
      </VStack>
    )
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
})

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSignature: (task, base64) => dispatch(addSignature(task, base64)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Signature))
