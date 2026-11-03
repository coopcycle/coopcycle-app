import { ActivityIndicator, BackHandler, InteractionManager, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { initialize } from '../../redux/Dispatch/actions';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';
import {
  selectFilteredTaskLists,
  selectFilteredUnassignedTasksNotCancelled,
} from '../../redux/Dispatch/selectors';
import { selectSelectedDate } from '../../shared/logistics/redux';
import { useAllTasks } from './useAllTasks';
import AddButton from './components/AddButton';
import GroupedTasks from './components/GroupedTasks';
import { useTaskListsContext } from '../courier/contexts/TaskListsContext';

export default function AllTasks({ navigation, route }) {
  const { t } = useTranslation();
  const context = useTaskListsContext();
  const isEditMode = context?.isEditMode;
  const clearSelectedTasksFromContext = context?.clearSelectedTasks;

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectFilteredUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectFilteredTaskLists);

  const dispatch = useDispatch();

  const { isLoading, isFetching, isError, refetch } = useAllTasks(selectedDate);

  const handleRefetch = () => {
    context?.clearSelectedTasks();
    refetch();
    dispatch(clearSelectedTasks());
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isEditMode) {
        clearSelectedTasksFromContext?.();
        dispatch(clearSelectedTasks());
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isEditMode, clearSelectedTasksFromContext, dispatch]);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
    return () => handle.cancel();
  }, [dispatch]);

  // Any of the four queries failing lands here, and a dropped connection is
  // routine on the road, so the screen has to offer a way back: without the
  // button the only way out is restarting the app.
  if (isError) {
    return (
      <Center flex={1}>
        <Heading>{t('AN_ERROR_OCCURRED')} </Heading>
        <Text>{t('TRY_LATER')}</Text>
        <Button
          className="mt-4"
          isDisabled={isFetching}
          onPress={handleRefetch}
          testID="dispatchRetry">
          <ButtonText>{t('RETRY')}</ButtonText>
        </Button>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator animating={true} size="large" />
      </Center>
    );
  }

  return (
    <>
      <Box className="bg-background-100">
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={{ fontWeight: '700' }}>{selectedDate.format('ll')}</Text>
        </AddButton>
      </Box>
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
