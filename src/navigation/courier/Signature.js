import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content,
  Icon, Text, Button, Footer, FooterTab
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

import { addSignature } from '../../redux/Courier'

class Signature extends Component {

  _saveImage() {
    const task = this.props.navigation.getParam('task')
    this._sketchCanvas.getBase64('jpg', false, true, true, true, (err, base64) => {
      if (!err) {
        this.props.addSignature(task, base64)
        this.props.navigation.navigate('TaskCompleteHome', { task })
      }
    })
  }

  _clearCanvas() {
    this._sketchCanvas.clear()
  }

  render() {

    return (
      <Container>
        <View style={ styles.content }>
          <Text note style={{ textAlign: 'center', marginBottom: 20 }}>
            { this.props.t('SIGNATURE_DISCLAIMER') }
          </Text>
          <View style={ styles.canvasContainer }>
            <SketchCanvas
              ref={ component => this._sketchCanvas = component }
              style={{ flex: 1 }}
              strokeColor={ 'black' }
              strokeWidth={ 7 } />
          </View>
          <Button light block onPress={ this._clearCanvas.bind(this) }>
            <Text>{ this.props.t('SIGNATURE_CLEAR') }</Text>
          </Button>
        </View>
        <Footer>
          <FooterTab>
            <Button full onPress={ this._saveImage.bind(this) }>
              <Text style={{ color: '#ffffff' }}>
                { this.props.t('SIGNATURE_ADD') }
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  canvasContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 1
  }
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(Signature))
