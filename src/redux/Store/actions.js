import _ from 'lodash';
import { createAction } from 'redux-actions';

import { setLoading } from '../App/actions';
import { selectStore } from './selectors';

export const LOAD_DELIVERIES_SUCCESS = '@store/LOAD_DELIVERIES_SUCCESS';
export const CREATE_DELIVERY_SUCCESS = '@store/CREATE_DELIVERY_SUCCESS';
export const LOAD_TASKS_SUCCESS = '@store/LOAD_TASKS_SUCCESS';
export const SET_LOADING_MORE = '@store/SET_LOADING_MORE';
export const SET_REFRESHING = '@store/SET_REFRESHING';
export const INIT_SUCCESS = '@store/INIT_SUCCESS';


export const createDeliverySuccess = createAction(CREATE_DELIVERY_SUCCESS);
export const loadDeliveriesSuccess = createAction(
  LOAD_DELIVERIES_SUCCESS,
  (store, deliveries, pagination) => ({
    store,
    deliveries,
    pagination,
  }),
);
export const initSuccess = createAction(
  INIT_SUCCESS,
  (store, deliveries, pagination) => ({
    store,
    deliveries,
    pagination,
  }),
);
export const loadTasksSuccess = createAction(
  LOAD_TASKS_SUCCESS,
  (delivery, pickup, dropoff) => ({
    delivery,
    pickup,
    dropoff,
  }),
);

export const setLoadingMore = createAction(SET_LOADING_MORE);
export const setRefreshing = createAction(SET_REFRESHING);

export function createDelivery(delivery, onSuccess) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    if (delivery.dropoff.address['@id']) {
      delivery = {
        ...delivery,
        dropoff: {
          ...delivery.dropoff,
          address: delivery.dropoff.address['@id'],
        },
      };
    }

    dispatch(setLoading(true));

    httpClient
      .post('/api/deliveries', delivery)
      .then(res => {
        dispatch(createDeliverySuccess(res));
        dispatch(setLoading(false));
        onSuccess();
      })
      .catch(e => {
        dispatch(setLoading(false));
      });
  };
}

export function loadDeliveries(store, refresh = false) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    refresh ? dispatch(setRefreshing(true)) : dispatch(setLoading(false));

    return httpClient
      .get(`${store['@id']}/deliveries?order[dropoff.before]=desc`)
      .then(res => {
        dispatch(
          loadDeliveriesSuccess(store, res['hydra:member'], {
            next: res['hydra:view']['hydra:next'],
            totalItems: res['hydra:totalItems'],
          }),
        );
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      })
      .catch(e => {
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      });
  };
}

export function loadMoreDeliveries() {
  return (dispatch, getState) => {
    const { app, store } = getState();
    const { httpClient } = app;
    const { deliveries, pagination, loadingMore } = store;

    if (loadingMore) {
      return;
    }

    if (pagination.totalItems === deliveries.length) {
      return;
    }

    if (!pagination.next) {
      return;
    }

    dispatch(setLoadingMore(true));

    return httpClient
      .get(pagination.next)
      .then(res => {
        dispatch(
          loadDeliveriesSuccess(selectStore(getState()), res['hydra:member'], {
            next: res['hydra:view']['hydra:next'],
            totalItems: res['hydra:totalItems'],
          }),
        );
        dispatch(setLoadingMore(false));
      })
      .catch(e => {
        dispatch(setLoadingMore(false));
      });
  };
}

export function loadTasks(delivery) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(setLoading(true));

    Promise.all([
      httpClient.get(delivery.pickup['@id']),
      httpClient.get(delivery.dropoff['@id']),
    ])
      .then(values => {
        const [pickup, dropoff] = values;
        dispatch(loadTasksSuccess(delivery, pickup, dropoff));
        dispatch(setLoading(false));
      })
      .catch(e => {
        console.log(e);
        dispatch(setLoading(false));
      });
  };
}

export function init(store) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(setLoading(false));

    Promise.all([
      httpClient.get(`${store['@id']}/deliveries?order[dropoff.before]=desc`),
    ])
      .then(values => {
        const [deliveries] = values;
        dispatch(
          initSuccess(
            store,
            deliveries['hydra:member'],
            {
              next: deliveries['hydra:view']['hydra:next'],
              totalItems: deliveries['hydra:totalItems'],
            },
          ),
        );
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      })
      .catch(e => {
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      });
  };
}
