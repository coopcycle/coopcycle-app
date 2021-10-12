import React from 'react'
import { Avatar } from 'native-base'

export default ({ baseURL, username }) => {

  const uri = `${baseURL}/images/avatars/${username}.png`

  return (
    <Avatar size="sm" source={{ uri }} />
  )
}
