import { self } from 'react-native-workers';

/* get message from application. String only ! */
self.onmessage = (message) => {
  console.log(message);
}

// setInterval(() => {
//   self.postMessage("hello from worker");
// }, 1000);

