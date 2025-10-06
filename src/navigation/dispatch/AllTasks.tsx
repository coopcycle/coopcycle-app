import { ActivityIndicator, InteractionManager, View } from 'react-native';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { initialize } from '../../redux/Dispatch/actions';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';
import {
  selectDispatchUiTaskFilters,
  selectFilteredTaskLists,
  selectFilteredUnassignedTasksNotCancelled,
  selectKeywordFilters,
} from '../../redux/Dispatch/selectors';
import { selectSelectedDate } from '../../shared/logistics/redux';
import { useAllTasks } from './useAllTasks';
import { useBackgroundHighlightColor } from '../../styles/theme';
import AddButton from './components/AddButton';
import GroupedTasks from './components/GroupedTasks';
import { useTaskListsContext } from '../courier/contexts/TaskListsContext';

export default function AllTasks({ navigation, route }) {
  const { t } = useTranslation();
  const context = useTaskListsContext();

  const selectedDate = useSelector(selectSelectedDate);
  const uiFilters = useSelector(selectDispatchUiTaskFilters);
  const keywordFilters = useSelector(selectKeywordFilters);
  const allFilters = [...uiFilters, ...keywordFilters];
  const unassignedTasks = useSelector(
    selectFilteredUnassignedTasksNotCancelled(allFilters),
  );
  const taskLists = useSelector(selectFilteredTaskLists(allFilters));

  const dispatch = useDispatch();

  const { isFetching, isError, refetch } = useAllTasks(selectedDate);
  const bgHighlightColor = useBackgroundHighlightColor();

  const handleRefetch = () => {
    context?.clearSelectedTasks();
    refetch();
    dispatch(clearSelectedTasks());
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);

  if (isError) {
    return (
      <Center flex={1}>
        <Heading>{t('AN_ERROR_OCCURRED')} </Heading>
        <Text>{t('TRY_LATER')}</Text>
      </Center>
    );
  }

  if (isFetching) {
    return (
      <Center flex={1}>
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
          <Text style={{ fontWeight: '700' }}>{selectedDate.format('ll')}</Text>
        </AddButton>
      </View>
      <GroupedTasks
        isFetching={isFetching}
        refetch={handleRefetch}
        route={route}
        taskLists={taskLists}
        unassignedTasks={unassignedTasks}
      />
    </>
  );
}
