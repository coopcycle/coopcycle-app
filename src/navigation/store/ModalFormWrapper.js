import { Box, Button, ScrollView, VStack } from 'native-base';
import { SafeAreaView } from 'react-native';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import { useBackgroundContainerColor } from '../../styles/theme';

export default function ModalFormWrapper({
  children,
  handleSubmit,
  t,
  isSubmit = false,
  disabled = false,
  disabledMessage,
}) {
  const backgroundColor = useBackgroundContainerColor();

  const buttonLabel = disabled
    ? disabledMessage
    : isSubmit
    ? t('SUBMIT')
    : t('NEXT');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}>
      <VStack
        flex={1}
        justifyContent="space-between"
        style={{
          backgroundColor,
        }}>
        <KeyboardAdjustView style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="handled" // tap is handled by the children in the forms
          >
            <Box p="5" gap="3">
              {children}
            </Box>
          </ScrollView>
          <Box p="5">
            <Button
              onPress={handleSubmit}
              disabled={disabled}
              style={disabled ? { opacity: 0.5 } : {}}>
              {buttonLabel}
            </Button>
          </Box>
        </KeyboardAdjustView>
      </VStack>
    </SafeAreaView>
  );
}
