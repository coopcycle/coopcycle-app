import { ParamListBase, RouteProp } from '@react-navigation/core';
import { NavigationProp, NavigationState } from '@react-navigation/native';
import Task from '@/src/types/task';

let navigateAfter = null;

/**
 * The courier and the dispatch trees each hold their own copy of the task and
 * order navigators. They used to be registered under the same two names, and
 * since the container runs with `navigationInChildEnabled`, a `navigate()` that
 * the caller's own branch could not handle was free to land in the other
 * branch — moving the drawer with it. The names below are unique per branch, so
 * which one a screen means is decided here rather than by whichever navigator
 * React Navigation happened to reach first.
 *
 * Candidates are listed in order of preference, for the one caller that has no
 * navigator of its own to resolve against (the push handler, which holds the
 * container ref).
 */
const TASK_ROUTES = ['CourierTask', 'DispatchTask'];
const COURIER_FIRST_ORDER_ROUTES = ['CourierOrder', 'DispatchOrder'];
const DISPATCH_FIRST_ORDER_ROUTES = ['DispatchOrder', 'CourierOrder'];

const findRouteNameInState = (
  state: NavigationState | undefined,
  candidates: string[],
): string | undefined => {
  if (!state) {
    return undefined;
  }

  const here = candidates.find(name => state.routeNames?.includes(name));
  if (here) {
    return here;
  }

  // The focused branch first: a caller that could not resolve against its own
  // navigators (the order screen, which the two trees both host) means the one
  // the user is looking at, not whichever happens to be mounted as well.
  const routes = state.routes ?? [];
  const ordered =
    state.index != null && routes[state.index]
      ? [routes[state.index], ...routes.filter((_, i) => i !== state.index)]
      : routes;

  for (const route of ordered) {
    const found = findRouteNameInState(route.state as NavigationState, candidates);
    if (found) {
      return found;
    }
  }

  return undefined;
};

// What the resolver reads off whatever the caller hands it, which ranges from a
// screen's navigation prop to the container ref.
type RouteResolvable = {
  getState?: () => NavigationState | undefined;
  getParent?: () => RouteResolvable | undefined;
  getRootState?: () => NavigationState | undefined;
};

/**
 * The first of `candidates` that one of the navigators enclosing `navigation`
 * declares — so a screen always reaches the copy it actually sits in.
 */
const resolveRouteName = (
  navigation: RouteResolvable | undefined,
  candidates: string[],
): string => {
  for (let nav = navigation; nav; nav = nav.getParent?.()) {
    const match = candidates.find(name =>
      nav.getState?.()?.routeNames?.includes(name),
    );
    if (match) {
      return match;
    }
  }

  // Nothing above the caller declares one of them: it is holding the container
  // ref, not a screen's navigation. Fall back to whichever is mounted, keeping
  // the caller's stated preference.
  return (
    findRouteNameInState(navigation?.getRootState?.(), candidates) ??
    candidates[0]
  );
};

export const navigateToOrder = (navigation, orderNumber: string, isFromCourier = false, status = 'TODO', extraData = {}) => {
  const params = {
    orderNumber,
    isFromCourier,
    status,
    ...extraData
  };
  const screen = resolveRouteName(
    navigation,
    isFromCourier ? COURIER_FIRST_ORDER_ROUTES : DISPATCH_FIRST_ORDER_ROUTES,
  );
  navigation.navigate(screen, { screen: 'OrderHome', params });
};

export const navigateToTask = (navigation, route, task: Task, tasks: Task[] = []) => {
  if (route?.name !== 'TaskHome') {
    navigateAfter = route.name;
  }

  const params = {
    task,
    // Only the ids of the surrounding list: React Navigation holds params in
    // its own state (and they are reported with navigation events), and this
    // is a whole task list. `TaskHome` resolves them against the store.
    taskIds: tasks.map(t => t['@id']),
    navigateAfter,
  };

  navigation.navigate(resolveRouteName(navigation, TASK_ROUTES), {
    screen: 'TaskHome',
    params,
  });
};

export const navigateToCompleteTask = (
  navigation,
  route,
  task,
  tasks = [],
) => {
  const params = {
    task,
    tasks,
    navigateAfter: route?.name || null,
  };

  navigation.navigate(resolveRouteName(navigation, TASK_ROUTES), {
    screen: 'TaskComplete',
    params: {
      screen: 'TaskCompleteHome',
      params: params,
    },
  });
};

export const navigateToReportTask = (
  navigation,
  route,
  task,
) => {
  const params = {
    task,
    tasks: [],
    navigateAfter: route.name,
  };

  navigation.navigate(resolveRouteName(navigation, TASK_ROUTES), {
    screen: 'TaskComplete',
    params: {
      screen:'ReportIncidentHome',
      params: params
    },
  });
};

export const navigateToProofOfDeliveryFromReportIncident = (
  navigation, route, task, tasks, success
) => {
  navigation.navigate('TaskCompleteProofOfDelivery', {
    task,
    tasks,
    navigateAfter: route.params?.navigateAfter,
    success,
  }, { merge: true})
};

export const navigateBackToCompleteTask = (
  navigation: NavigationProp<ParamListBase>,
  route: RouteProp<ParamListBase>,
) => {
  const task = route.params?.task;
  const tasks = route.params?.tasks;
  const navigateAfter = route.params?.navigateAfter;
  const success = route.params?.success;

  navigation.popTo(success ? 'TaskCompleteHome' : 'ReportIncidentHome', {
    task,
    tasks,
    navigateAfter,
  });
};
