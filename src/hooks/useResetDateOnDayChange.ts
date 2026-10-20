import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { changeDate as changeCourierDate } from '../redux/Courier/taskActions';
import { changeDate as changeDispatchDate } from '../redux/Dispatch/actions';
import { selectTaskSelectedDate } from '../redux/Courier';
import { selectSelectedDate } from '../shared/logistics/redux';

/**
 * Put the selected day back on today once today has moved on.
 *
 * Neither selected date is persisted, so both start on the day the app was
 * launched — and nothing moved them afterwards. An app that is never force
 * quit therefore keeps working against the day it was opened on: paynal's
 * board was still asking the API for 16 October on the 20th, and every
 * assignment made from it was refused by the cross-day guard.
 *
 * Only a date in the *past* is corrected. A dispatcher planning tomorrow has
 * chosen that day deliberately, and it stops being in the future by itself.
 *
 * This mirrors what the restaurant dashboard already does for its own date
 * (see `navigation/restaurant/Dashboard.tsx`): catch the rollover with a timer
 * while the app is open, and catch the case where it slept through midnight
 * when it comes back to the foreground.
 */
export function useResetDateOnDayChange() {
  const dispatch = useDispatch();
  const dispatchDate = useSelector(selectSelectedDate);
  const courierDate = useSelector(selectTaskSelectedDate);

  // The two are kept in step by every screen that selects a date, and
  // `logistics.date` is the one assignments are PUT against, so they are set
  // together here too rather than left to drift apart.
  const resetIfStale = useCallback(() => {
    const today = moment().startOf('day');

    const isStale =
      dispatchDate.isBefore(today, 'day') || courierDate.isBefore(today, 'day');

    if (!isStale) {
      return;
    }

    const now = moment().toISOString();

    dispatch(changeDispatchDate(now));
    dispatch(changeCourierDate(now));
  }, [courierDate, dispatch, dispatchDate]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        resetIfStale();
      }
    });

    return () => subscription.remove();
  }, [resetIfStale]);

  useEffect(() => {
    const msUntilMidnight = moment().add(1, 'day').startOf('day').diff(moment());

    const timer = setTimeout(resetIfStale, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [resetIfStale]);
}
