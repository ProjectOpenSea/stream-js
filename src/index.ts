import { Socket, Channel } from 'phoenix';
import {
  ApiConfig,
  BasePushedUpdateMessage,
  EventType,
  ItemMetadataUpdate,
  ItemListedEvent,
  ItemSoldEvent,
  ItemTransferredEvent
} from './types';

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

  public subscribe_item_metadata_updates(
    collection_slug: string = ALL,
    callback: (arg: ItemMetadataUpdate) => any
  ): void {
    this.subscribe(EventType.ITEM_METADATA_UPDATED, collection_slug, callback);
  }

  public subscribe_item_listed_events(
    collection_slug: string = ALL,
    callback: (arg: ItemListedEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_LISTED, collection_slug, callback);
  }

  public subscribe_item_sold_events(
    collection_slug: string = ALL,
    callback: (arg: ItemSoldEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_SOLD, collection_slug, callback);
  }

  public subscribe_item_transferred_events(
    collection_slug: string = ALL,
    callback: (arg: ItemTransferredEvent) => any
  ): void {
    this.subscribe(EventType.ITEM_TRANSFERRED, collection_slug, callback);
  }

  public subscribe_all_item_events(
    collection_slug: string = ALL,
    callback: (arg: BasePushedUpdateMessage) => any
  ): void {
    this.subscribe_item_listed_events(collection_slug, callback);
    this.subscribe_item_sold_events(collection_slug, callback);
    this.subscribe_item_transferred_events(collection_slug, callback);
  }

  private subscribe(
    event_type: EventType,
    collection_slug: string,
    callback: (arg0: BasePushedUpdateMessage) => any
  ): void {
    const topic = 'collection:' + collection_slug;
    const channel = this.get_channel(topic);
    channel.on(event_type, callback);
  }

  private get_channel(topic: string): Channel {
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
