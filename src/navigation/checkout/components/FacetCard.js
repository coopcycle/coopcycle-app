import { AspectRatio, Box, Heading, Image, Stack } from 'native-base';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, TouchableOpacity } from 'react-native';

function FacetCard(props) {
  const windowWidth = Dimensions.get('window').width * 0.42;
  return (
    <TouchableOpacity
      alignItems="center"
      style={{
        margin: 5,
      }}
      onPress={() => props.onPress({ name: props.name, image: props.image })}>
      <Box
        width={windowWidth}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}>
        <AspectRatio w="100%" ratio={16 / 9}>
          <Image
            source={{
              uri: props.image,
            }}
            alt="image"
          />
        </AspectRatio>
        <Stack p="2" space={1} alignItems="center">
          <Heading size="sm" ml="-1">
            {props.name}
          </Heading>
        </Stack>
      </Box>
    </TouchableOpacity>
  );
}

export default withTranslation()(FacetCard);
