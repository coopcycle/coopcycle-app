import { ActivityIndicator, InteractionManager } from "react-native";
import {
  Center,
  Heading,
  Text,
  View
} from 'native-base';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  darkGreyColor,
  mediumGreyColor,
  whiteColor
} from '../../styles/common';
import { initialize } from "../../redux/Dispatch/actions";
import { selectFilteredTaskLists, selectFilteredUnassignedTasksNotCancelled } from '../../shared/src/logistics/redux/selectors';
import { selectSelectedDate } from "../../shared/logistics/redux";
import { UNASSIGNED_TASKS_LIST_ID } from '../../shared/src/constants';
import { useAllTasks } from "./useAllTasks";
import AddButton from './components/AddButton';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';
import GroupedTasks from "./components/GroupedTasks";

export default function AllTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectFilteredUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectFilteredTaskLists);

  const dispatch = useDispatch();

  const {
    isFetching,
    isError,
    refetch
  } = useAllTasks(selectedDate);

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
    )
  }

  return (
    <BasicSafeAreaView>
        <View style={{ backgroundColor: mediumGreyColor }}>
          <AddButton
            testID="dispatchNewDelivery"
            onPress={() => navigation.navigate('DispatchNewDelivery')}>
            <Text style={{ fontWeight: '700' }}>
              {selectedDate.format('ll')}
            </Text>
          </AddButton>
        </View>
        <GroupedTasks
            sections={sections}
            navigation
            route={route}
            isFetching={isFetching}
            refetch={refetch}
        />
      </BasicSafeAreaView>
  );
}
