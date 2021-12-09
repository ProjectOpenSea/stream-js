import { suite, test } from 'mocha-typescript';
import { OpenSeaPushClient } from '../src';
import sinon from 'sinon';
import { WebSocket } from 'mock-socket';

window.WebSocket = WebSocket;
window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

class TestTransport {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
}

suite('OpenSeaPushClientTest', () => {
  test('OpenSeaPushClientTest constructer', () => {
    const apiToken = 'test';
    const sdk = new OpenSeaPushClient(apiToken, {
      apiUrl: 'ws://localhost:4000',
      socketOptions: { transport: TestTransport }
    });
  });
});
