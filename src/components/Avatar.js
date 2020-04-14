import React from 'react'
import { Thumbnail } from 'native-base'

export default ({ baseURL, username }) => {

  const uri = `${baseURL}/images/avatars/${username}.png`

  return (
    <Thumbnail small source={{ uri }} />
  )
}
