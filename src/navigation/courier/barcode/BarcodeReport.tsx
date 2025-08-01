import React from 'react';
import { withTranslation } from 'react-i18next';
import { Button, VStack, Text } from 'native-base';
import { Alert } from 'react-native';

function BarcodeReport({ route, t, navigation }) {
  const { entity } = route.params;
  return (
    <VStack space={4} p="4">
      <Text fontSize="lg" pb="2">
        {t('TASK')} #{entity?.id}
      </Text>
      <Button
        colorScheme="dark"
        size="lg"
        onPress={
          // () => navigation.navigate('CourierUpdateParcel', { entity })
          () => Alert.alert(null, 'Not yet supported, coming soon!')
        }>
        {t('UPDATE_PARCEL_DETAILS')}
      </Button>
      <Button
        colorScheme="yellow"
        size="lg"
        onPress={() =>
          navigation.navigate('CourierReportIncident', { entity })
        }>
        {t('REPORT_AN_INCIDENT')}
      </Button>
    </VStack>
  );
}

export default withTranslation()(BarcodeReport);
