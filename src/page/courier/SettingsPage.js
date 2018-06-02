import React, { Component } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Container, Icon, Text, List, ListItem, Left, Body, Right, Switch } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { localeDetector } from '../../i18n'

import Preferences from '../../Preferences'

class SettingsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      keepAwake: false
    }
  }

  componentDidMount() {
    Preferences.getKeepAwake().then(keepAwake => {
      this.setState({ keepAwake })
    })
  }

  onKeepAwakeChange(value) {
    Preferences.setKeepAwake(value).then(() => {
      this.setState({ keepAwake: value })
    })
  }

  render() {

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <List style={{ marginTop: 20 }}>
          <ListItem icon>
            <Left>
              <Icon name="power" />
            </Left>
            <Body>
              <Text>{this.props.t('SETTING_KEEP_AWAKE')}</Text>
            </Body>
            <Right>
              <Switch
                onValueChange={ this.onKeepAwakeChange.bind(this) }
                value={ this.state.keepAwake } />
            </Right>
          </ListItem>
        </List>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = translate()(SettingsPage)
