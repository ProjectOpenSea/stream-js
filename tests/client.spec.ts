import { EventType, OpenSeaStreamClient } from '../src';
import WS from 'jest-websocket-mock';
import { getSocket, getChannels, encode, mockEvent } from './helpers';
import { collectionTopic } from '../src/helpers';

let server: WS;
let streamClient: OpenSeaStreamClient;

beforeEach(() => {
  server = new WS('ws://localhost:1234');
});

afterEach(() => {
  server.close();
});

afterEach(() => {
  streamClient.disconnect();
});

test('constructor', async () => {
  streamClient = new OpenSeaStreamClient({
    token: 'test',
    apiUrl: 'ws://localhost:1234'
  });

  const socket = getSocket(streamClient);
  expect(socket.protocol()).toBe('ws');
  expect(socket.endPointURL()).toBe(
    'ws://localhost:1234/websocket?token=test&vsn=2.0.0'
  );
  expect(socket.isConnected()).toBe(false);
});

describe('unsubscribe', () => {
  test('channel', () => {
    streamClient = new OpenSeaStreamClient({
      token: 'test',
      apiUrl: 'ws://localhost:1234'
    });

    const unsubscribec1 = streamClient.onItemListed('c1', jest.fn());
    const unsubscribec2 = streamClient.onItemListed('c2', jest.fn());

    expect(Array.from(getChannels(streamClient).keys())).toEqual([
      'collection:c1',
      'collection:c2'
    ]);

    unsubscribec1();
    expect(Array.from(getChannels(streamClient).keys())).toEqual([
      'collection:c2'
    ]);

    unsubscribec2();
    expect(Array.from(getChannels(streamClient).keys())).toEqual([]);
  });

  test('socket', () => {
    streamClient = new OpenSeaStreamClient({
      token: 'test',
      apiUrl: 'ws://localhost:1234'
    });

    streamClient.onItemListed('c1', jest.fn());
    streamClient.onItemListed('c2', jest.fn());

    streamClient.disconnect();
    expect(Array.from(getChannels(streamClient).keys())).toEqual([]);
  });
});

describe('event streams', () => {
  Object.values(EventType).forEach((eventType) => {
    test(`${eventType}`, async () => {
      const collectionSlug = 'c1';

      streamClient = new OpenSeaStreamClient({
        token: 'test',
        apiUrl: 'ws://localhost:1234',
        connectOptions: { transport: WebSocket }
      });

      // connection will fail as phoenix socket modified the endpoint url
      const socket = getSocket(streamClient);
      jest
        .spyOn(socket, 'endPointURL')
        .mockImplementation(() => 'ws://localhost:1234');

      const onItemListed = jest.fn();
      const unsubscribe = streamClient.onEvents(
        collectionSlug,
        [eventType],
        (event) => onItemListed(event)
      );

      const payload = mockEvent(eventType, {});

      server.send(
        encode({
          topic: collectionTopic(collectionSlug),
          event: eventType,
          payload
        })
      );

      expect(onItemListed).toBeCalledWith(payload);

      server.send(
        encode({
          topic: collectionTopic(collectionSlug),
          event: eventType,
          payload
        })
      );

      expect(onItemListed).toBeCalledTimes(2);

      unsubscribe();

      server.send(
        encode({
          topic: collectionTopic(collectionSlug),
          event: eventType,
          payload
        })
      );

      expect(onItemListed).toBeCalledTimes(2);
    });
  });
});
