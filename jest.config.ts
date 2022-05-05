/* eslint-disable @typescript-eslint/no-var-requires */
import type { Config } from '@jest/types';

const pack = require('./package');

const config: Config.InitialOptions = {
  displayName: pack.name,
  id: pack.name,
  modulePaths: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom'
};

export default config;
