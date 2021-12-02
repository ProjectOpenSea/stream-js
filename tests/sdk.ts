import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { OpenSeaPushClient } from '../src';
import { Socket, LongPoll } from 'phoenix';
import sinon from 'sinon';
import { WebSocket } from 'mock-socket';

window.WebSocket = WebSocket;
window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

suite('SDK', () => {
  test('should construct', () => {
    const apiToken = 'test';
    const sdk = new OpenSeaPushClient(apiToken, {
      apiUrl: 'ws://localhost:4000',
      socketOptions: { transport: TestTransport }
    });
  });
});
