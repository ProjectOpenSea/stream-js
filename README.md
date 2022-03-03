# OpenSea Push Client

[![https://badges.frapsoft.com/os/mit/mit.svg?v=102](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A Javascript SDK for receiving updates from OpenSea pushed over websocket. We currently support the following event types for collections:

- item listed
- item sold
- item transferred
- item metadata updates
- item cancelled

This is a best effort delievery messaging system. Messages that are not received due to connection errors will not be re-sent. Messages may be delievered out of order.

# Setup

Run `nvm use`  
And then `npm install`

# Getting Started

For our beta test users we are only using basic authentication. To get started, request the basic authentication token and base endpoint from us. Later on we will align authentication with our API.

## Create a client

```javascript
import { OpenSeaPushClient } from '@opensea/pushed-updates-sdk';

const client = new OpenSeaPushClient({
  apiUrl: 'apiURL',
  token: 'dummy_token'
});
```

## Manually connecting to the socket (optional)

Client will automatically connect to the socket as soon as you subscribe to the first channel.
If you would like to connect to the socket manually (before that), you can do so:

```javascript
client.connect();
```

After successfully connecting to our websocket it is time to listen to specific events you're interested in!

## Streaming metadata updates

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

## Streaming auction cancellations events

```javascript
client.onItemCancelled('collection-slug', (event) => {
  // handle event
});
```

# Subscribing to events from all collections

If you'd like to listen to an event from all collections use wildcard `*` for the `collection_slug` parameter.

# Types

Types are included to work with our event payload objects easier.

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
