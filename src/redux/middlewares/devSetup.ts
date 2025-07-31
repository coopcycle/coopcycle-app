import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import reactotron from 'reactotron-react-native';
import rdiff from 'recursive-diff';

import Config from 'react-native-config';

import ReactotronConfig from '../../../ReactotronConfig';

function logger(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      const stateBefore = storeAPI.getState();
      const result = next(action);
      const stateAfter = storeAPI.getState();

      const diff = rdiff.getDiff(stateBefore, stateAfter);

      const opToLabel = {
        add: 'ADDED',
        delete: 'DELETED',
        update: 'UPDATED',
      };

      const unflattenDiff = diff.reduce((acc, { op, path, val }) => {
        const lastKey = path.pop();
        const lastObj = path.reduce((acc, key) => {
          if (!acc[key]) {
            acc[key] = {};
          }
          return acc[key];
        }, acc);
        lastObj[`${lastKey} (${opToLabel[op]})`] = val;
        return acc;
      }, {});

      if (diff.length > 0) {
        console.log('REDUX STATE changed:', unflattenDiff);
      }

      reactotron.display({
        name: 'REDUX STATE',
        value: {
          diff: unflattenDiff,
          after: stateAfter,
          before: stateBefore,
        },
        preview:
          diff.length > 0 ? `number of changes: ${diff.length}` : 'no changes',
        important: false,
      });

      return result;
    };
  };
}

export default function configureForDevelopment(middlewaresList) {
  const middlewares = [...middlewaresList];

  middlewares.push(
    createLogger({
      level: Config.DEBUG_REDUX_LOGGER_LEVEL ?? 'log',
      collapsed: true,
    }),
  );

  middlewares.push(logger);

  return composeWithDevTools(
    applyMiddleware(...middlewares),
    ReactotronConfig.createEnhancer(),
  );
}
