import { Icon, ChevronRightIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { TouchableOpacity } from 'react-native';

const Detail = ({ item }) => {
  const { icon, text, component, onPress } = item;

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
          as={icon}
          size="xl"
          style={{ color: '#ccc' }}
        />
        {body}
        {onPress && (
          <Icon size="xl" as={ChevronRightIcon} style={{ color: '#ccc' }} />
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default Detail;
