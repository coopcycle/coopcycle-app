import { View } from 'native-base';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, InteractionManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { initialize } from '../../redux/Dispatch/actions';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import {
  selectSelectedDate,
  selectTaskLists,
} from '../../shared/logistics/redux';
import GroupedTasks from './components/GroupedTasks';
import { useAllTasks } from './useAllTasks';
import { Center, Heading, Text } from 'native-base';
import { UNASSIGNED_TASKS_LIST_ID } from '../../shared/src/constants';
import {
  darkGreyColor,
  whiteColor
} from '../../styles/common';
import { useBackgroundHighlightColor } from '../../styles/theme';
import AddButton from './components/AddButton';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';

export default function AllTasks({ navigation, route }) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectTaskLists);

  const dispatch = useDispatch();

  const { isFetching, isError, refetch } = useAllTasks(selectedDate);
  const bgHighlightColor = useBackgroundHighlightColor()

  const handleRefetch = () => {
    refetch()
    dispatch(clearSelectedTasks());
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);

  // Combine unassigned tasks and task lists to use in SectionList
  const sections = [
    {
      backgroundColor: whiteColor,
      count: unassignedTasks.length,
      data: unassignedTasks,
      id: UNASSIGNED_TASKS_LIST_ID,
      isUnassignedTaskList: true,
      taskListId: UNASSIGNED_TASKS_LIST_ID,
      textColor: darkGreyColor,
      title: t('DISPATCH_UNASSIGNED_TASKS'),
    },
    ...taskLists.map(taskList => ({
      backgroundColor: taskList.color ? taskList.color : darkGreyColor,
      count: taskList.items.length,
      data: taskList.items,
      id: `${taskList.username.toLowerCase()}TasksList`,
      isUnassignedTaskList: false,
      taskListId: taskList['@id'],
      textColor: whiteColor,
      title: taskList.username,
    })),
  ];

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
          <Text style={{ fontWeight: '700' }}>{selectedDate.format('ll')}</Text>
        </AddButton>
      </View>
      <GroupedTasks
        sections={sections}
        navigation
        route={route}
        isFetching={isFetching}
        refetch={handleRefetch}
      />
    </>
  );
}
