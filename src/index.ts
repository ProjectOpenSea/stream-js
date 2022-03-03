import { Socket, Channel } from 'phoenix';
import {
  ClientConfig,
  BasePushedUpdateMessage,
  EventType,
  ItemMetadataUpdate,
  ItemListedEvent,
  ItemSoldEvent,
  ItemTransferredEvent,
  ItemReceivedBidEvent,
  ItemReceivedOfferEvent,
  ItemCancelledEvent,
  Callback
} from './types';

export class OpenSeaPushClient {
  private socket: Socket;
  private channels: Map<string, Channel>;

  constructor({ socketOptions, token, apiUrl }: ClientConfig) {
    this.socket = new Socket(apiUrl, {
      params: {
        token
      },
      ...socketOptions
    });
    this.socket.onError((e) => console.log('Socket error', e));
    this.socket.connect();
    this.channels = new Map<string, Channel>();
  }

  private getChannel = (topic: string): Channel => {
    let channel = this.channels.get(topic);
    if (channel) {
      return channel;
    }
    channel = this.socket.channel(topic);
    console.log('CHANNEL', topic);
    channel
      .join()
      .receive('ok', () =>
        console.log(`Successfully joined channel "${topic}"`)
      )
      .receive('error', () =>
        console.error(`Failed to join channel "${topic}"`)
      );

    this.channels.set(topic, channel);
    return channel;
  };

  private subscribe = <Payload, Event extends BasePushedUpdateMessage<Payload>>(
    eventType: EventType,
    collectionSlug: string,
    callback: Callback<Event>
  ) => {
    const topic = `collection:${collectionSlug}`;
    const channel = this.getChannel(topic);
    channel.on(eventType, callback);
    return () => {
      channel
        .leave()
        .receive('ok', () =>
          console.log(
            `Succesfully left channel "${topic}" listening for ${eventType}`
          )
        );
    };
  };

  public subscribeItemMetadataUpdates = (
    collectionSlug: string,
    callback: Callback<ItemMetadataUpdate>
  ) => {
    return this.subscribe(
      EventType.ITEM_METADATA_UPDATED,
      collectionSlug,
      callback
    );
  };

  public subscribeItemCancelledEvents = (
    collectionSlug: string,
    callback: Callback<ItemCancelledEvent>
  ) => {
    return this.subscribe(EventType.ITEM_CANCELLED, collectionSlug, callback);
  };

  public subscribeItemListedEvents = (
    collectionSlug: string,
    callback: Callback<ItemListedEvent>
  ) => {
    return this.subscribe(EventType.ITEM_LISTED, collectionSlug, callback);
  };

  public subscribeItemSoldEvents = (
    collectionSlug: string,
    callback: Callback<ItemSoldEvent>
  ) => {
    return this.subscribe(EventType.ITEM_SOLD, collectionSlug, callback);
  };

  public subscribeItemTransferredEvents = (
    collectionSlug: string,
    callback: Callback<ItemTransferredEvent>
  ) => {
    return this.subscribe(EventType.ITEM_TRANSFERRED, collectionSlug, callback);
  };

  public subscribeItemReceivedOfferEvents = (
    collectionSlug: string,
    callback: Callback<ItemReceivedOfferEvent>
  ) => {
    return this.subscribe(
      EventType.ITEM_RECEIVED_OFFER,
      collectionSlug,
      callback
    );
  };

  public subscribeItemReceivedBidEvents = (
    collectionSlug: string,
    callback: Callback<ItemReceivedBidEvent>
  ) => {
    return this.subscribe(
      EventType.ITEM_RECEIVED_BID,
      collectionSlug,
      callback
    );
  };

  public subscribeToEvents = (
    collectionSlug: string,
    eventTypes: EventType[],
    callback: Callback<BasePushedUpdateMessage<unknown>>
  ) => {
    const subscriptions = eventTypes.map((eventType) =>
      this.subscribe(eventType, collectionSlug, callback)
    );

    return () => {
      for (const unsubscribe of subscriptions) {
        unsubscribe();
      }
    };
  };

  public subscribeToAllEvents = (
    collectionSlug: string,
    callback: Callback<BasePushedUpdateMessage<unknown>>
  ) => {
    return this.subscribeToEvents(
      collectionSlug,
      Object.values(EventType),
      callback
    );
  };
}
