import { SafeAreaView } from 'react-native';
import { useBackgroundContainerColor } from '../../styles/theme';
import { Box, Button, VStack } from 'native-base';

export default function ModalFormWrapper({ children, handleSubmit, t }) {
  const backgroundColor = useBackgroundContainerColor();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <VStack
        flex={1}
        justifyContent="space-between"
        style={{
          backgroundColor,
        }}>
        <Box p="3">{children}</Box>
        <Box p="3">
          <Button onPress={handleSubmit}>{t('SUBMIT')}</Button>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
