import { Avatar } from 'native-base';
import React from 'react';

export default ({ baseURL, username }) => {
  const uri = `${baseURL}/images/avatars/${username}.png`;

  return <Avatar size="sm" source={{ uri }} />;
};
