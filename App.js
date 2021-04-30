import React from 'react';

import { LogBox } from 'react-native';
import clone from 'lodash/clone';
import Providers from './navigation';

// LogBox.ignoreLogs(['Setting a timer']);
const _console = clone(console);
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default function App() {
  return <Providers />;
}
