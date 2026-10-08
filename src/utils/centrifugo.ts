import {
  Centrifuge,
  ConnectedContext,
  DisconnectedContext,
  State,
  Subscription,
} from 'centrifuge';
import parseUrl from 'url-parse';

/**
 * CoopCycle servers still run Centrifugo with `use_client_protocol_v1_by_default`,
 * a compatibility shim kept for clients on centrifuge-js v2. A modern SDK speaks
 * protocol v2 and has to say so, or the server assumes v1 and refuses the
 * connection outright with "bad request".
 *
 * @see https://centrifugal.dev/docs/getting-started/migration_v4
 */
const PROTOCOL_VERSION_PARAM = 'cf_protocol_version=v2';

function connectionUrl(baseURL: string): string {
  const url = parseUrl(baseURL);
  const protocol = url.protocol === 'https:' ? 'wss' : 'ws';

  return `${protocol}://${url.hostname}/centrifugo/connection/websocket?${PROTOCOL_VERSION_PARAM}`;
}

type CreateOptions = {
  /**
   * Returns a fresh connection token when the current one nears expiry.
   *
   * Omit it where there is nobody to issue one -- order tracking hands out a
   * short-lived token scoped to a single order, and the connection simply ends
   * when it runs out.
   */
  getToken?: () => Promise<string>;
  onConnected?: (ctx: ConnectedContext) => void;
  onDisconnected?: (ctx: DisconnectedContext) => void;
};

/**
 * What the backend publishes on our channels: a named event and its data.
 *
 * `LiveUpdates` wraps every payload this way, so a subscriber reads
 * `data.event.name` to decide what happened.
 */
export type LiveUpdate = {
  event: {
    name: string;
    data?: unknown;
  };
};

export function createCentrifuge(
  baseURL: string,
  token: string,
  { getToken, onConnected, onDisconnected }: CreateOptions = {},
): Centrifuge {
  const centrifuge = new Centrifuge(connectionUrl(baseURL), {
    token,
    debug: __DEV__,
    ...(getToken ? { getToken } : {}),
  });

  if (onConnected) {
    centrifuge.on('connected', onConnected);
  }

  if (onDisconnected) {
    centrifuge.on('disconnected', onDisconnected);
  }

  return centrifuge;
}

/**
 * Subscribes to a channel and hands each publication's payload to `onMessage`.
 *
 * In centrifuge-js v2 a subscription was created and subscribed in one call, and
 * the callback received the whole message. From v3 on a subscription is an
 * object with its own lifecycle and the payload arrives as `ctx.data`.
 *
 * Asking twice for the same channel is tolerated: v2 returned the existing
 * subscription, whereas `newSubscription()` throws. React runs effects twice
 * under StrictMode, so that difference is not theoretical.
 */
export function subscribe(
  centrifuge: Centrifuge,
  channel: string,
  onMessage: (data: LiveUpdate) => void,
): Subscription {
  const subscription =
    centrifuge.getSubscription(channel) ?? centrifuge.newSubscription(channel);

  // The SDK types a publication's data as `any`; this asserts the envelope our
  // own backend always publishes.
  subscription.on('publication', ctx => onMessage(ctx.data as LiveUpdate));
  subscription.subscribe();

  return subscription;
}

/**
 * Whether the client is connected right now.
 *
 * v2 had isConnected(); from v3 on the client exposes its state instead.
 */
export function isConnected(centrifuge: Centrifuge | null): boolean {
  return centrifuge?.state === State.Connected;
}
