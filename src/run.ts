// import { OpenSeaPushClient } from './index';

// const apiToken = 'test';
// var TRANSPORTS = {
//   longpoll: 'longpoll',
//   websocket: 'websocket'
// };

// class TestTransport {
//   constructor(endpoint: string) {}
// }

// const sdk = new OpenSeaPushClient(apiToken, {
//   apiUrl: 'ws://localhost:4000/socket',
//   socketOptions: { transport: TestTransport }
// });

// sdk.order_events_for_assets();

var phoenixSocket = require('phoenix-socket');

let apiURL = 'ws://localhost:4000/socket';

let socket = new Socket(apiURL, { params: { userToken: '123' } });

socket.connect();
