import {
  Avatar,
  AvatarFallbackText,
  AvatarImage
} from '@/components/ui/avatar'
import React from 'react';

export default ({ baseURL, username }) => {
  const uri = `${baseURL}/images/avatars/${username}.png`;

  return (
    <Avatar size="sm">
      <AvatarImage
        source={{
          uri
        }}
      />
    </Avatar>
  );
};
