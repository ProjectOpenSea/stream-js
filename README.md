<p align="center">
  <img src="./img/banner.png" />
</p>

[![Version][version-badge]][version-link]
[![npm][npm-badge]][npm-link]
[![Test CI][ci-badge]][ci-link]
[![Coverage Status][coverage-badge]][coverage-link]
[![License][license-badge]][license-link]
[![Docs][docs-badge]][docs-link]

# OpenSea Stream API - TypeScript SDK

> [!IMPORTANT]  
> The OpenSea Stream API is currently under maintenance and will be restored shortly.

A TypeScript SDK for receiving updates from the OpenSea Stream API - pushed over websockets. We currently support the following event types on a per-collection basis:

- item listed
- item sold
- item transferred
- item metadata updates
- item cancelled
- item received offer
- item received bid

This is a best effort delivery messaging system. Messages that are not received due to connection errors will not be re-sent. Messages may be delivered out of order. This SDK is offered as a beta experience as we work with developers in the ecosystem to make this a more robust and reliable system.

Documentation: https://docs.opensea.io/reference/stream-api-overview

# Installation

Please use Node.js version 16 or greater to make sure common crypto dependencies work.

- Install this package: `npm install @opensea/stream-js`
- Install types for phoenix: `npm install --save-dev @types/phoenix`
- **NodeJS only:** Install required libraries: `npm install ws node-localstorage`

# Getting Started

## Authentication

In order to make onboarding easy, we've integrated the OpenSea Stream API with our existing API key system. The API keys you have been using for the REST API should work here as well. If you don't already have one, you can create an API key in your OpenSea account settings.

## Create a client

### Browser

```typescript
import { OpenSeaStreamClient } from '@opensea/stream-js';

const client = new OpenSeaStreamClient({
  token: 'YOUR_OPENSEA_API_KEY'
});
```

### Node.js

```typescript
import { OpenSeaStreamClient } from '@opensea/stream-js';
import { WebSocket } from 'ws';
import { LocalStorage } from 'node-localstorage';

const client = new OpenSeaStreamClient({
  token: 'YOUR_OPENSEA_API_KEY',
  connectOptions: {
    transport: WebSocket,
    sessionStorage: LocalStorage
  }
});
```

You can also optionally pass in:

- a `network` if you would like to access testnet networks.
  - The default value is `Network.MAINNET` for all mainnet chains
  - Can also select `Network.TESTNET` for all testnet chains
- `apiUrl` if you would like to access another OpenSea Stream API endpoint. Not needed if you provide a network or use the default values.
- an `onError` callback to handle errors. The default behavior is to `console.error` the error.
- a `logLevel` to set the log level. The default is `LogLevel.INFO`.

## Available Networks

The OpenSea Stream API is available on the following networks:

### Mainnet

`wss://stream.openseabeta.com/socket`

### Testnet

`wss://testnets-stream.openseabeta.com/socket`

To create testnet instance of the client, you can create it with the following arguments:

```typescript
import { OpenSeaStreamClient, Network } from '@opensea/stream-js';

const client = new OpenSeaStreamClient({
  network: Network.TESTNET,
  token: 'YOUR_OPENSEA_API_KEY'
});
```

An API key is not needed for testnets, so any value is okay for `token` when network is `Network.TESTNET`.

## Manually connecting to the socket (optional)

The client will automatically connect to the socket as soon as you subscribe to the first channel.
If you would like to connect to the socket manually (before that), you can do so:

```typescript
client.connect();
```

After successfully connecting to our websocket it is time to listen to specific events you're interested in!

## Streaming metadata updates

We will only send out metadata updates when we detect that the metadata provided in `tokenURI` has changed from what OpenSea has previously cached.

```typescript
client.onItemMetadataUpdated('collection-slug', (event) => {
  // handle event
});
```

## Streaming item listed events

```typescript
client.onItemListed('collection-slug', (event) => {
  // handle event
});
```

## Streaming item sold events

```typescript
client.onItemSold('collection-slug', (event) => {
  // handle event
});
```

## Streaming item transferred events

```typescript
client.onItemTransferred('collection-slug', (event) => {
  // handle event
});
```

## Streaming bids and offers

```typescript
client.onItemReceivedBid('collection-slug', (event) => {
  // handle event
});

client.onItemReceivedOffer('collection-slug', (event) => {
  // handle event
});
```

## Streaming multiple event types

```typescript
client.onEvents(
  'collection-slug',
  [EventType.ITEM_RECEIVED_OFFER, EventType.ITEM_TRANSFERRED],
  (event) => {
    // handle event
  }
);
```

## Streaming order cancellations events

```typescript
client.onItemCancelled('collection-slug', (event) => {
  // handle event
});
```

# Subscribing to events from all collections

If you'd like to listen to an event from all collections use wildcard `*` for the `collectionSlug` parameter.

# Types

Types are included to make working with our event payload objects easier.

# Disconnecting

## From a specific stream

All subscription methods return a callback function that will unsubscribe from a stream when invoked.

```typescript
const unsubscribe = client.onItemMetadataUpdated('collection-slug', noop);

unsubscribe();
```

## From the socket

```typescript
client.disconnect();
```

## Contributing

See [the contributing guide](./.github/contributing.md) for detailed instructions on how to get started with this project.

## License

[MIT](LICENSE) Copyright 2022 Ozone Networks, Inc.

[version-badge]: https://img.shields.io/github/package-json/v/ProjectOpenSea/stream-js
[version-link]: https://github.com/ProjectOpenSea/stream-js/releases
[npm-badge]: https://img.shields.io/npm/v/@opensea/stream-js?color=red
[npm-link]: https://www.npmjs.com/package/@opensea/stream-js
[ci-badge]: https://github.com/ProjectOpenSea/stream-js/actions/workflows/ci.yml/badge.svg
[ci-link]: https://github.com/ProjectOpenSea/stream-js/actions/workflows/ci.yml
[coverage-badge]: https://coveralls.io/repos/github/ProjectOpenSea/stream-js/badge.svg?branch=main
[coverage-link]: https://coveralls.io/github/ProjectOpenSea/stream-js?branch=main
[license-badge]: https://img.shields.io/github/license/ProjectOpenSea/stream-js
[license-link]: https://github.com/ProjectOpenSea/stream-js/blob/main/LICENSE
[docs-badge]: https://img.shields.io/badge/Stream.js-documentation-informational
[docs-link]: https://github.com/ProjectOpenSea/stream-js#getting-started
