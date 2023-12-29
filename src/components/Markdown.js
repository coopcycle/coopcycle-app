import React from 'react'
import RNMarkdown from 'react-native-markdown-display'
import { useBaseTextColor } from '../styles/theme'

export default function Markdown({ children, style }) {
  const baseTextColor = useBaseTextColor()

  const componentStyle = {
    body: {
      color: baseTextColor,
    },
    ...style,
  }

  return (
    <RNMarkdown style={componentStyle} mergeStyle={true}>
      {children}
    </RNMarkdown>
  )
}
