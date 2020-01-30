import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import { selectServer } from '../../redux/App/actions'

class ChooseCity extends Component {

  render() {

    return (
      <Container>
        <Content scrollEnabled={ false } contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <View style={ styles.list }>
            { this.props.servers.map((server, key) => (
              <TouchableOpacity key={ key } style={ styles.item }
                onPress={ () => this.props.selectServer(server.coopcycle_url) }
                testID={ server.city }>
                <Text style={{ textAlign: 'center' }}>{ server.city }</Text>
              </TouchableOpacity>
            )) }
          </View>
          { this.props.hasError && (
            <View style={{ marginVertical: 20 }}>
              <Text style={{ color: '#ed2f2f', textAlign: 'center' }}>{ this.props.message }</Text>
            </View>
          ) }
        </Content>
      </Container>
    )
  }
}

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
    servers: _.filter(state.app.servers, server => server.hasOwnProperty('coopcycle_url')),
    hasError: !!state.app.selectServerError,
    message: state.app.selectServerError,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectServer: server => dispatch(selectServer(server)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ChooseCity))
