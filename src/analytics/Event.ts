const event = {
  system: {
    backgroundGeolocation: {
      _category: 'background_geoloc',
      httpAuthorization: 'http_authorization',
      configure: 'configure',
    },
  },
  user: {
    login: {
      _category: 'user_login',
      submit: 'submit',
      success: 'success',
      failure: 'failure',
    },
  },
  courier: {
    _category: 'courier',
    tasksChangedAlertSound: 'tasks_changed_alert_sound',
    tasksChangedMessage: 'tasks_changed_message',
  },
  restaurant: {
    _category: 'restaurant',
    orderCreatedMessage: 'order_created_message',
  },
};

export default event;
