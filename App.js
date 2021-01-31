import React from 'react';

import Providers from './navigation';
import { LogBox } from 'react-native';
import clone from 'lodash/clone';

LogBox.ignoreLogs(['Setting a timer']);
const _console = clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default function App() {
  return <Providers />;
}
