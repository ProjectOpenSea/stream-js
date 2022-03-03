# OpenSea Push Client

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
import { WebSocket } from 'ws';

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
client.onItemMetadataUpdated('collection-slug', (myEvent) => {
  // Your use case
  console.log(myEvent);
});
```

## Streaming item listed events

```javascript
client.onItemListed('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

## Streaming item sold events

```javascript
client.onItemSold('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

## Streaming item transferred events

```javascript
client.onItemTransferred('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

## Streaming bids and offers

```javascript
client.onItemReceivedBid('collection-slug', (myEvent) => {
  // do something
});

client.onItemReceivedOffer('collection-slug', (myEvent) => {
  // do something
});
```

## Streaming multiple event types

```javascript
client.onEvents(
  'collection-slug',
  [EventType.ITEM_RECEIVED_OFFER, EventType.ITEM_TRANSFERRED],
  (myEvent) => {
    console.log(myEvent);
  }
);
```

## Streaming auction cancellations events

```javascript
client.onItemCancelled('collection-slug', (myEvent) => {
  // do something
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
