# OpenSea Streaming API - JavaScript SDK

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A Javascript SDK for receiving updates from the OpenSea Streaming API - pushed over websockets. We currently support the following event types for collections:

- item listed
- item sold
- item transferred
- item metadata updates
- item cancelled
- item received offer
- item received bid

This is a best effort delievery messaging system. Messages that are not received due to connection errors will not be re-sent. Messages may be delievered out of order. This SDK is offered as a beta experience as we work with developers in the ecosystem to make this a more robust and reliable system.

# Setup

Run `nvm use`  
And then `npm install`

# Getting Started

For our beta test users we are only using basic authentication using the same API Keys we provide in our REST API. To get started, request the basic API Key from us [here](https://docs.opensea.io/reference/request-an-api-key).

## Create a client

```javascript
import { OpenSeaStreamClient } from '@opensea/opensea-stream-js-sdk';

const client = new OpenSeaStreamClient({
  apiUrl: 'apiURL',
  token: 'dummyToken'
});
```

You can also optionally pass in:

- an `onError` callback to handle errors. The default behavior is to `console.error` the error.
- a `logLevel` to set the log level. The default is `LogLevel.NOTSET`.

## Manually connecting to the socket (optional)

The client will automatically connect to the socket as soon as you subscribe to the first channel.
If you would like to connect to the socket manually (before that), you can do so:

```javascript
client.connect();
```

After successfully connecting to our websocket it is time to listen to specific events you're interested in!

## Streaming metadata updates

We will only send out metadata updates when we detect that the metadata provided in `tokenURI` has changed from what OpenSea has previously cached.

```javascript
client.onItemMetadataUpdated('collection-slug', (event) => {
  // handle event
});
```

## Streaming item listed events

```javascript
client.onItemListed('collection-slug', (event) => {
  // handle event
});
```

## Streaming item sold events

```javascript
client.onItemSold('collection-slug', (event) => {
  // handle event
});
```

## Streaming item transferred events

```javascript
client.onItemTransferred('collection-slug', (event) => {
  // handle event
});
```

## Streaming bids and offers

```javascript
client.onItemReceivedBid('collection-slug', (event) => {
  // handle event
});

client.onItemReceivedOffer('collection-slug', (event) => {
  // handle event
});
```

## Streaming multiple event types

```javascript
client.onEvents(
  'collection-slug',
  [EventType.ITEM_RECEIVED_OFFER, EventType.ITEM_TRANSFERRED],
  (event) => {
    // handle event
  }
);
```

## Streaming order cancellations events

```javascript
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

```javascript
const unsubscribe = client.onItemMetadataUpdated('collection-slug', noop);

unsubscribe();
```

## From the socket

```javascript
client.disconnect();
```
