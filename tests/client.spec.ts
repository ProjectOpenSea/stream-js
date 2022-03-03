import { EventType, OpenSeaPushClient } from '../src';
import WS from 'jest-websocket-mock';
import { getSocket, getChannels, encode } from './helpers';
import { collectionTopic } from '../src/helpers';

let server: WS;
let pushClient: OpenSeaPushClient;

beforeEach(() => {
  server = new WS('ws://localhost:1234');
});

afterEach(() => {
  server.close();
});

afterEach(() => {
  pushClient.disconnect();
});

test('constructor', async () => {
  pushClient = new OpenSeaPushClient({
    token: 'test',
    apiUrl: 'ws://localhost:1234'
  });

  const socket = getSocket(pushClient);
  expect(socket.protocol()).toBe('ws');
  expect(socket.endPointURL()).toBe(
    'ws://localhost:1234/websocket?token=test&vsn=2.0.0'
  );
  expect(socket.isConnected()).toBe(false);
});

describe('unsubscribe', () => {
  test('channel', () => {
    pushClient = new OpenSeaPushClient({
      token: 'test',
      apiUrl: 'ws://localhost:1234'
    });

    const unsubscribec1 = pushClient.onItemListed('c1', jest.fn());
    const unsubscribec2 = pushClient.onItemListed('c2', jest.fn());

    expect(Array.from(getChannels(pushClient).keys())).toEqual([
      'collection:c1',
      'collection:c2'
    ]);

    unsubscribec1();
    expect(Array.from(getChannels(pushClient).keys())).toEqual([
      'collection:c2'
    ]);

    unsubscribec2();
    expect(Array.from(getChannels(pushClient).keys())).toEqual([]);
  });

  test('socket', () => {
    pushClient = new OpenSeaPushClient({
      token: 'test',
      apiUrl: 'ws://localhost:1234'
    });

    pushClient.onItemListed('c1', jest.fn());
    pushClient.onItemListed('c2', jest.fn());

    pushClient.disconnect();
    expect(Array.from(getChannels(pushClient).keys())).toEqual([]);
  });
});

describe('event streams', () => {
  Object.values(EventType).forEach((eventType) => {
    test(`${eventType}`, async () => {
      const collectionSlug = 'c1';

      pushClient = new OpenSeaPushClient({
        token: 'test',
        apiUrl: 'ws://localhost:1234',
        connectOptions: { transport: WebSocket }
      });

      // connection will fail as phoenix socket modified the endpoint url
      const socket = getSocket(pushClient);
      jest
        .spyOn(socket, 'endPointURL')
        .mockImplementation(() => 'ws://localhost:1234');

      const onItemListed = jest.fn();
      const unsubscribe = pushClient.onEvents(
        collectionSlug,
        [eventType],
        (event) => onItemListed(event)
      );

      const payload = {
        chain: {
          name: 'Ethereum'
        },
        collection: {
          slug: 'bored-ape'
        },
        event_type: eventType,
        item: {
          contract_address: '0x',
          token_id: '11'
        },
        payload: {},
        timestamp: Date.now().toString()
      };

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
