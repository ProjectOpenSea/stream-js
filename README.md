# OpenSea Push Client

A Javascript SDK for receiving updates from OpenSea pushed over websocket. We currently support the following event types for collections: 

- item listed 
- item sold 
- item transferred
- item metadata updates 

This is a best effort delievery messaging system. Messages that are not received due to connection errors will not be re-sent. Messages may be delievered out of order. 

# Setup 

Run `nvm use`  
And then `npm install` 

# Getting Started 

For our beta test users we are only using basic authentication. To get started, request the basic authentication token and base endpoint from us.  Later on we will align authentication with our API. 

## Start a socket connection 
```javascript 
import { OpenSeaPushClient } from 'opensea-push-client'  
import { WebSocket } from 'ws';

const client = new OpenSeaPushClient('dummy_token', {
  apiUrl: 'apiURL',
  socketOptions: {
    transport: WebSocket
  }
});
```

After successfully connecting to our websocket it is time to listen to specific events you're interested in! 

## Streaming metadata updates 

```javascript 
client.subscribeItemMetadataUpdates('collection-slug', (myEvent) => {
  // Your use case
  console.log(myEvent);
});
```

## Streaming item listed events 

```javascript 
client.subscribeItemListedEvents('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

## Streaming item sold events 

```javascript 
client.subscribeItemSoldEvents('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

## Streaming item transferred events 

```javascript 
client.subscribeItemTransferredEvents('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

## Streaming all item events 

```javascript 
client.subscribeAllItemEvents('collection-slug', (myEvent) => {
  console.log(myEvent);
});
```

# Subscribing to events from all collections 

If you'd like to listen to an event from all collections use wildcard `*` for the `collection_slug` parameter. 

# Types 

Types are included to work with our event payload objects easier. 

