import React from 'react'
import { Icon, Button } from 'native-base'

export default ({ children, ...props }) => {

  return (
    <Button iconLeft full { ...props }>
      <Icon type="FontAwesome" name="plus" style={{ color: '#ffffff', fontSize: 16 }} />
      { children }
    </Button>
  )
}


