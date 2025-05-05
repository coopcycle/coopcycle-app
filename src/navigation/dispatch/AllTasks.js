import { ScrollView, View } from 'native-base';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InteractionManager, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { initialize } from "../../redux/Dispatch/actions";
import { selectUnassignedTasksNotCancelled } from "../../redux/Dispatch/selectors";
import { selectSelectedDate, selectTaskLists } from "../../shared/logistics/redux";
import GroupedTasks from "./components/GroupedTasks";
import { useAllTasks } from "./useAllTasks";

import {
  Center,
  Heading,
  Text
} from 'native-base';

import {
  darkGreyColor,
  primaryColor,
  whiteColor
} from '../../styles/common';
import { useColorModeToken } from '../../styles/theme';
import AddButton from './components/AddButton';

export default function AllTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectTaskLists);

  const dispatch = useDispatch();

  // TODO check blackMode
  const screenBackgroundColor = useColorModeToken('#E6E2E2', '#131313');
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

   // Combine unassigned tasks and task lists into a single grouped data structure
    const sections = [
      {
        // TODO add translations
        title: t('NEW_ORDER'),
        data: unassignedTasks,
        backgroundColor: whiteColor,
        textColor: darkGreyColor,
        tasksType: 'unassignedTasks'
      },
      ...taskLists.map(taskList => ({
        title: `${taskList.username} (${taskList.items.length})`,
        data: taskList.items,
        backgroundColor: taskList.color ? taskList.color : darkGreyColor,
        textColor: whiteColor,
        tasksType: 'taskList'
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

  return (
    // TODO check safe area
      <>
        <View>
          <AddButton
            testID="dispatchNewDelivery"
            onPress={() => navigation.navigate('DispatchNewDelivery')}>
            <Text style={{ fontWeight: '700' }}>
              {selectedDate.format('ll')}
            </Text>
          </AddButton>
        </View>
        {!isFetching &&
        <GroupedTasks
            sections={sections}
            navigation
            route
            isFetching={isFetching}
            refetch={refetch}
        />}
      </>
  );
}
