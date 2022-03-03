import { Socket, Channel } from 'phoenix';
import { collectionTopic } from './helpers';
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

  constructor({
    token,
    apiUrl,
    connectOptions,
    onError = (error) => console.error('Socket error', error)
  }: ClientConfig) {
    this.socket = new Socket(apiUrl, {
      params: { token },
      ...connectOptions
    });
    this.socket.onError(onError);
    this.channels = new Map<string, Channel>();
  }

  public connect = () => {
    this.socket.connect();
  };

  public disconnect = (
    callback = () => console.log(`Succesfully disconnected from socket`)
  ) => {
    this.channels.clear();
    return this.socket.disconnect(callback);
  };

  private createChannel = (topic: string): Channel => {
    const channel = this.socket.channel(topic);
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

  private getChannel = (topic: string): Channel => {
    let channel = this.channels.get(topic);
    if (!channel) {
      channel = this.createChannel(topic);
    }
    return channel;
  };

  private on = <Payload, Event extends BasePushedUpdateMessage<Payload>>(
    eventType: EventType,
    collectionSlug: string,
    callback: Callback<Event>
  ) => {
    this.socket.connect();

    const topic = collectionTopic(collectionSlug);
    const channel = this.getChannel(topic);
    channel.on(eventType, callback);
    return () => {
      channel.leave().receive('ok', () => {
        this.channels.delete(topic);
        console.log(
          `Succesfully left channel "${topic}" listening for ${eventType}`
        );
      });
    };
  };

  public onItemMetadataUpdated = (
    collectionSlug: string,
    callback: Callback<ItemMetadataUpdate>
  ) => {
    return this.on(EventType.ITEM_METADATA_UPDATED, collectionSlug, callback);
  };

  public onItemCancelled = (
    collectionSlug: string,
    callback: Callback<ItemCancelledEvent>
  ) => {
    return this.on(EventType.ITEM_CANCELLED, collectionSlug, callback);
  };

  public onItemListed = (
    collectionSlug: string,
    callback: Callback<ItemListedEvent>
  ) => {
    return this.on(EventType.ITEM_LISTED, collectionSlug, callback);
  };

  public onItemSold = (
    collectionSlug: string,
    callback: Callback<ItemSoldEvent>
  ) => {
    return this.on(EventType.ITEM_SOLD, collectionSlug, callback);
  };

  public onItemTransferred = (
    collectionSlug: string,
    callback: Callback<ItemTransferredEvent>
  ) => {
    return this.on(EventType.ITEM_TRANSFERRED, collectionSlug, callback);
  };

  public onItemReceivedOffer = (
    collectionSlug: string,
    callback: Callback<ItemReceivedOfferEvent>
  ) => {
    return this.on(EventType.ITEM_RECEIVED_OFFER, collectionSlug, callback);
  };

  public onItemReceivedBid = (
    collectionSlug: string,
    callback: Callback<ItemReceivedBidEvent>
  ) => {
    return this.on(EventType.ITEM_RECEIVED_BID, collectionSlug, callback);
  };

  public onEvents = (
    collectionSlug: string,
    eventTypes: EventType[],
    callback: Callback<BasePushedUpdateMessage<unknown>>
  ) => {
    const subscriptions = eventTypes.map((eventType) =>
      this.on(eventType, collectionSlug, callback)
    );

    return () => {
      for (const unsubscribe of subscriptions) {
        unsubscribe();
      }
    };
  };
}
