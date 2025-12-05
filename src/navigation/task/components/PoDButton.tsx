import { Text } from '@/components/ui/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '@/src/i18n';
import { Button } from '@/components/ui/button';
import { navigateToProofOfDeliveryFromReportIncident } from '../../utils';
export const PoDButton = ({ task, tasks }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const t = i18n.t;

  return (
    <Button
        style={{ backgroundColor: '#BB4711' }}
      onPress={() =>
        navigateToProofOfDeliveryFromReportIncident(navigation, route, task, tasks)
        
      }>
      <Text style={{ color:'white' }}>{t('TASK_ADD_PROOF_OF_DELIVERY')}</Text>
    </Button>
  );
};
