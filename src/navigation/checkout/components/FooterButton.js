import React, { Component } from 'react'
import { Footer, FooterTab, Button, Text } from 'native-base'
import PropTypes from 'prop-types'

class FooterButton extends Component {

  render() {

    const { text, ...otherProps } = this.props

    return (
      <Footer>
        <FooterTab>
          <Button block transparent { ...otherProps }>
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>{ text }</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}

FooterButton.defaultProps = {
}

FooterButton.propTypes = {
  text: PropTypes.string.isRequired,
  testID: PropTypes.string,
  onPress: PropTypes.func,
}

export default FooterButton
