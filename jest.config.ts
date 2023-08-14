/* eslint-disable @typescript-eslint/no-var-requires */
import type { Config } from '@jest/types';

const pack = require('./package');

const config: Config.InitialOptions = {
  displayName: pack.name,
  id: pack.name,
  modulePaths: ['<rootDir>/src'],
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};

export default config;
