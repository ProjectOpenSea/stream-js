import { OpenSeaPushClient } from '../src';
import WS from 'jest-websocket-mock';
import { getSocket, getChannels } from './helpers';

let sdk: OpenSeaPushClient;

afterEach(() => {
  sdk.disconnect();
});

test('constructor', async () => {
  sdk = new OpenSeaPushClient({
    token: 'test',
    apiUrl: 'ws://localhost:1234',
    connectOptions: { transport: WS }
  });

  const socket = getSocket(sdk);
  expect(socket.protocol()).toBe('ws');
  expect(socket.endPointURL()).toBe(
    'ws://localhost:1234/websocket?token=test&vsn=2.0.0'
  );
  expect(socket.isConnected()).toBe(false);

  sdk.disconnect();
});

test('should cleanup channels on unsubscribe', () => {
  sdk = new OpenSeaPushClient({
    token: 'test',
    apiUrl: 'ws://localhost:1234',
    connectOptions: { transport: WS }
  });

  const unsubscribec1 = sdk.onItemListed('c1', jest.fn());
  const unsubscribec2 = sdk.onItemListed('c2', jest.fn());

  expect(Array.from(getChannels(sdk).keys())).toEqual([
    'collection:c1',
    'collection:c2'
  ]);

  unsubscribec1();

  expect(Array.from(getChannels(sdk).keys())).toEqual(['collection:c2']);

  unsubscribec2();

  expect(Array.from(getChannels(sdk).keys())).toEqual([]);

  sdk.disconnect();
});

test('should cleanup channels on disconnect', () => {
  sdk = new OpenSeaPushClient({
    token: 'test',
    apiUrl: 'ws://localhost:1234',
    connectOptions: { transport: WS }
  });

  sdk.onItemListed('c1', jest.fn());
  sdk.onItemListed('c2', jest.fn());

  sdk.disconnect();
  expect(Array.from(getChannels(sdk).keys())).toEqual([]);
});
