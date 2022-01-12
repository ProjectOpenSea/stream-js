import { Socket, Channel } from 'phoenix';
import {
  ApiConfig,
  BasePushedUpdateMessage,
  EventType,
  ItemMetadataUpdate,
  ItemListedEvent,
  ItemSoldEvent,
  ItemTransferredEvent,
  ItemReceivedBidEvent,
  ItemReceivedOfferEvent,
  ItemCancelledEvent
} from './types';
import { WebSocket } from 'ws';

const ALL = '*';

export class OpenSeaPushClient {
  private socket: Socket;
  private channels: Map<string, Channel>;

  constructor(apiToken: string, { apiUrl, socketOptions }: ApiConfig) {
    const opts = {
      params: {
        token: apiToken
      },
      ...socketOptions
    };
    this.socket = new Socket(apiUrl, opts);
    this.socket.onError((e) => {
      console.log(e);
    });
    this.socket.connect();
    this.channels = new Map<string, Channel>();
  }

  public subscribeItemMetadataUpdates(
    collection_slug: string = ALL,
    callback: (arg: ItemMetadataUpdate) => any
  ): void {
    this.subscribe(EventType.ITEM_METADATA_UPDATED, collection_slug, callback);
  }

  public subscribeItemCancelledEvents(
    collection_slug: string = ALL,
    callback: (arg: ItemCancelledEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_CANCELLED, collection_slug, callback);
  }

  public subscribeItemListedEvents(
    collection_slug: string = ALL,
    callback: (arg: ItemListedEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_LISTED, collection_slug, callback);
  }

  public subscribeItemSoldEvents(
    collection_slug: string = ALL,
    callback: (arg: ItemSoldEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_SOLD, collection_slug, callback);
  }

  public subscribeItemTransferredEvents(
    collection_slug: string = ALL,
    callback: (arg: ItemTransferredEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_TRANSFERRED, collection_slug, callback);
  }

  public subscribeItemReceivedOfferEvents(
    collection_slug: string = ALL,
    callback: (arg: ItemReceivedOfferEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_RECEIVED_OFFER, collection_slug, callback);
  }

  public subscribeItemReceivedBidEvents(
    collection_slug: string = ALL,
    callback: (arg: ItemReceivedBidEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_RECEIVED_BID, collection_slug, callback);
  }

  public subscribeAllItemEvents(
    collection_slug: string = ALL,
    callback: (arg: BasePushedUpdateMessage) => any
  ): void {
    this.subscribeItemListedEvents(collection_slug, callback);
    this.subscribeItemSoldEvents(collection_slug, callback);
    this.subscribeItemTransferredEvents(collection_slug, callback);
    this.subscribeItemMetadataUpdates(collection_slug, callback);
  }

  private subscribe(
    event_type: EventType,
    collection_slug: string,
    callback: (arg0: BasePushedUpdateMessage) => any
  ): void {
    const topic = 'collection:' + collection_slug;
    const channel = this.getChannel(topic);
    channel.on(event_type, callback);
  }

  private getChannel(topic: string): Channel {
    let channel = this.channels.get(topic);
    if (channel != undefined) {
      return channel;
    }
    channel = this.socket.channel(topic);
    channel
      .join()
      .receive('ok', ({ messages }) =>
        console.log('Successfully joined channel', messages || '')
      )
      .receive('error', ({ reason }) =>
        console.error('Failed to join channel', reason)
      );
    this.channels.set(topic, channel);
    return channel;
  }
}
