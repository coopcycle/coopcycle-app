import { Icon } from 'native-base';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Detail = ({ item }) => {
  const { iconType, iconName, text, component, onPress } = item;

  let touchableOpacityProps = {};
  if (onPress) {
    touchableOpacityProps = { onPress };
  }

  const body = (
    <Box flex={1} className="p-2">
      {text ? <Text fontSize="xs">{text}</Text> : null}
      {component && component}
    </Box>
  );

  return (
    <TouchableOpacity style={{ flex: 1 }} {...touchableOpacityProps}>
      <HStack className="items-center justify-center p-2">
        <Icon
          as={iconType ? iconType : Ionicons}
          name={iconName}
          style={{ color: '#ccc' }}
        />
        {body}
        {onPress && (
          <Icon as={Ionicons} name="arrow-forward" style={{ color: '#ccc' }} />
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default Detail;
