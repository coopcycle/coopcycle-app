import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import analyticsEvent from '../analytics/Event';
import tracker from '../analytics/Tracker';
import { loadOrder } from '../redux/Restaurant/actions';
import { message as wsMessage } from '../redux/middlewares/CentrifugoMiddleware/actions';
import store from '../redux/store';
import { parseNotification } from './index.android';

// data message was received in the background (works only on android)
const handler = async remoteMessage => {
  const message = parseNotification(remoteMessage, false);

  const { event } = message.data;

  if (event && event.name === 'order:created') {
    tracker.logEvent(
      analyticsEvent.restaurant._category,
      analyticsEvent.restaurant.orderCreatedMessage,
      'background_data_message',
    );

    store.dispatch(
      loadOrder(event.data.order, order => {
        if (order) {
          // Simulate a WebSocket message
          store.dispatch(
            wsMessage({
              name: 'order:created',
              data: { order },
            }),
          );
        }
      }),
    );
  }

  return Promise.resolve();
};

export default () => {
  // The background message handler below is *ALWAYS* called
  // when the app is in background or quit state
  // @see https://rnfirebase.io/messaging/usage#background-application-state
  setBackgroundMessageHandler(getMessaging(), handler);
};
