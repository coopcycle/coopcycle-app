import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import material from '../../../../native-base-theme/variables/material'

export default ({ heading, text, onPress, danger }) => {

  const btnStyles = [styles.btn]
  const btnTextHeadingStyles = [styles.btnTextHeading]
  const btnTextNoteStyles = []

  if (danger) {
    btnStyles.push(styles.btnDanger)
    btnTextHeadingStyles.push(styles.textDanger)
    btnTextNoteStyles.push(styles.textDanger)
  }

  const iconColor = danger ? material.brandDanger : '#ccc'

  return (
    <TouchableOpacity style={ btnStyles } onPress={ onPress }>
      <View>
        <Text style={ btnTextHeadingStyles }>
          { heading }
        </Text>
        <Text note style={ btnTextNoteStyles }>
          { text }
        </Text>
      </View>
      <Icon as={ FontAwesome } style={{ color: iconColor, alignSelf: 'center' }} name="arrow-right" />
    </TouchableOpacity>
  )

}

const styles = StyleSheet.create({
  btn: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnDanger: {
    borderColor: material.brandDanger,
  },
  btnTextHeading: {
    fontWeight: '700',
  },
  textDanger: {
    color: material.brandDanger,
  },
})
