import { useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import moment from 'moment';

import {
  loadTaskListsFailure,
  loadTaskListsSuccess,
  loadTasksFailure,
  loadTasksSuccess,
  loadUsersFailure,
  loadUsersSuccess,
} from '../../redux/Dispatch/actions';
import {
  useGetCourierUsersQuery,
  useGetTaskListsV2Query,
  useGetTasksQuery,
  useGetToursQuery,
} from '../../redux/api/slice';
import {
  loadToursFailure,
  loadToursSuccess,
} from '../../shared/logistics/redux';
import { DateOnlyString } from '../../utils/date-types';

export function useAllTasks(date: moment.Moment) {
  const dispatch = useDispatch();
  const dateOnlyString = useMemo(() => {
    return date.format('YYYY-MM-DD') as DateOnlyString;
  }, [date]);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isLoading: isLoadingCourierUsers,
    isFetching: isFetchingCourierUsers,
    refetch: refetchCourierUsers,
  } = useGetCourierUsersQuery(undefined, {
      refetchOnFocus: true,
      // @TODO SEE IF WE CAN GIVE A CACHE TTL...!
    });

  const {
    data: taskLists,
    isError: isErrorTaskLists,
    isFetching: isFetchingTaskLists,
    isLoading: isLoadingTaskLists,
    refetch: refetchTaskLists,
  } = useGetTaskListsV2Query(dateOnlyString, {
      refetchOnFocus: true,
      // @TODO SEE IF WE CAN GIVE A CACHE TTL...!
    });

  const {
    data: tasks,
    isError: isErrorTasks,
    isFetching: isFetchingTasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasksQuery(dateOnlyString, {
      refetchOnFocus: true,
      // @TODO SEE IF WE CAN GIVE A CACHE TTL...!
    });

  const {
    data: tours,
    isError: isErrorTours,
    isFetching: isFetchingTours,
    isLoading: isLoadingTours,
    refetch: refetchTours,
  } = useGetToursQuery(dateOnlyString, {
      refetchOnFocus: true,
      // @TODO SEE IF WE CAN GIVE A CACHE TTL...!
    });

  const isError = isErrorCourierUsers || isErrorTaskLists || isErrorTasks || isErrorTours;
  const isLoading = isLoadingCourierUsers || isLoadingTaskLists || isLoadingTasks || isLoadingTours;
  const isFetching = isFetchingCourierUsers || isFetchingTaskLists || isFetchingTasks || isFetchingTours;

  useEffect(() => {
    if (
      !isFetching &&
      !isError &&
      courierUsers &&
      taskLists &&
      tasks &&
      tours
    ) {
      dispatch(loadTaskListsSuccess(taskLists));
      dispatch(loadTasksSuccess(tasks));
      dispatch(loadToursSuccess(tours));
      dispatch(loadUsersSuccess(courierUsers));
    }
  }, [courierUsers, dispatch, isError, isFetching, taskLists, tasks, tours]);

  useEffect(() => {
    if (isError) {
      dispatch(loadTasksFailure());
      dispatch(loadTaskListsFailure());
      dispatch(loadToursFailure());
      dispatch(loadUsersFailure());
    }
  }, [dispatch, isError]);

  return {
    isError,
    isLoading,
    isFetching,
    // All four, not just the three that change through the day: the error
    // state is shown as soon as any of them fails, so leaving one out would
    // make a retry a no-op whenever that one is the one that broke.
    refetch: () => {
      refetchTasks();
      refetchTaskLists();
      refetchTours();
      refetchCourierUsers();
    },
  };
}
