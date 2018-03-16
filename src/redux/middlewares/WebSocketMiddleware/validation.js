/*
 * Simple validation logic for WebSocket middleware
 */
import { INIT, CONNECT, DISCONNECT, SEND } from './actions';

export const isWsAction = ({ type }) =>
  [
    INIT,
    CONNECT,
    DISCONNECT,
    SEND,
  ].some((x) => x === type)

export const validateAction = () => { }
