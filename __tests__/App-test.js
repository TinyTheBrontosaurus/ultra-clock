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

// This is a hail mary integration test. If it succeeds, that's good. If it fails it may be catching something
// interesting, but it also might be a wild goose chase.
it('Basic integration test', async () => {
  NativeModules.VersionModule = {getConstants: jest.fn()};

  renderer.create(<App />);

  await flushPromises();
});
