import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Text } from 'native-base'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import API from '../../API'
import Settings from '../../Settings'
import { selectServer } from '../../redux/App/actions'

class ChooseCity extends Component {

  render() {

    return (
      <Container>
        <Content scrollEnabled={ false } contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <View style={ styles.list }>
            { this.props.servers.map((server, key) => (
              <TouchableOpacity key={ key } style={ styles.item }
                onPress={ () => this.props.selectServer(server.coopcycle_url) }>
                <Text style={{ textAlign: 'center' }}>{ server.city }</Text>
              </TouchableOpacity>
            )) }
          </View>
        </Content>
      </Container>
    )
  }
}

const borderColor = '#b0b0b0'

const styles = StyleSheet.create({
  list: {
    borderTopColor: '#b0b0b0',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#b0b0b0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})

function mapStateToProps(state) {
  return {
    servers: _.filter(state.app.servers, server => server.hasOwnProperty('coopcycle_url'))
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectServer: server => dispatch(selectServer(server)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(ChooseCity))
