import { OpenSeaPushClient } from '../src';
import WS from 'jest-websocket-mock';
import { Socket } from 'phoenix';

const getSocket = (sdk: OpenSeaPushClient): Socket => {
  // @ts-expect-error private access
  return sdk.socket;
};

test('constructor', async () => {
  const sdk = new OpenSeaPushClient({
    token: 'test',
    apiUrl: 'ws://localhost:1234',
    socketOptions: { transport: WS }
  });

  const socket = getSocket(sdk);
  expect(socket.protocol()).toBe('ws');
  expect(socket.endPointURL()).toBe(
    'ws://localhost:1234/websocket?token=test&vsn=2.0.0'
  );
  expect(socket.isConnected()).toBe(false);
});
