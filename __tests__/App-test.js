/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import {NativeModules} from 'react-native';
const flushPromises = require('flush-promises');


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', async () => {
  NativeModules.VersionModule = {getConstants: jest.fn()};

  renderer.create(<App />);

  await flushPromises();
});
