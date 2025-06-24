import { ActivityIndicator, InteractionManager } from 'react-native';
import { Center, Heading, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'native-base';

import { initialize } from '../../redux/Dispatch/actions';
import { selectDispatchUiTaskFilters, selectFilteredTaskLists, selectFilteredUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import { selectSelectedDate } from '../../shared/logistics/redux';
import { useAllTasks } from './useAllTasks';
import { useBackgroundHighlightColor } from '../../styles/theme';
import AddButton from './components/AddButton';
import GroupedTasks from './components/GroupedTasks';


export default function AllTasks({ navigation, route }) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const uiFilters = useSelector(selectDispatchUiTaskFilters);
  const unassignedTasks = useSelector(selectFilteredUnassignedTasksNotCancelled(uiFilters));
  const taskLists = useSelector(selectFilteredTaskLists(uiFilters));

  const dispatch = useDispatch();

  const { isFetching, isError, refetch } = useAllTasks(selectedDate);
  const bgHighlightColor = useBackgroundHighlightColor()

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);

  if (isError) {
    return (
      <Center w="95%" h="80%">
        <Heading>{t('AN_ERROR_OCCURRED')} </Heading>
        <Text>{t('TRY_LATER')}</Text>
      </Center>
    );
  }

  if (isFetching) {
    return (
      <Center w="95%" h="80%">
        <ActivityIndicator animating={true} size="large" />
      </Center>
    );
  }

  return (
    <>
      <View style={{ backgroundColor: bgHighlightColor }}>
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={{ fontWeight: '700' }}>
            {selectedDate.format('ll')}
          </Text>
        </AddButton>
      </View>
      <GroupedTasks
        isFetching={isFetching}
        refetch={refetch}
        route={route}
        taskLists={taskLists}
        unassignedTasks={unassignedTasks}
      />
    </>
  );
}
