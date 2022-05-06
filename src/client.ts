import { Socket, Channel } from 'phoenix';
import { collectionTopic } from './helpers';
import {
  ClientConfig,
  BaseStreamMessage,
  EventType,
  ItemMetadataUpdate,
  ItemListedEvent,
  ItemSoldEvent,
  ItemTransferredEvent,
  ItemReceivedBidEvent,
  ItemReceivedOfferEvent,
  ItemCancelledEvent,
  Callback,
  LogLevel,
  Network
} from './types';
import { ENDPOINTS } from './constants';

export class OpenSeaStreamClient {
  private socket: Socket;
  private channels: Map<string, Channel>;
  private logLevel: LogLevel;

  constructor({
    network = Network.MAINNET,
    token,
    apiUrl,
    connectOptions,
    logLevel = LogLevel.INFO,
    onError = (error) => this.error(error)
  }: ClientConfig) {
    const endpoint = apiUrl || ENDPOINTS[network];
    const webTransportDefault =
      typeof window !== 'undefined' ? window.WebSocket : undefined;
    this.socket = new Socket(endpoint, {
      params: { token },
      transport: webTransportDefault,
      ...connectOptions
    });

    this.socket.onError(onError);
    this.channels = new Map<string, Channel>();
    this.logLevel = logLevel;
  }

  private debug(message: unknown) {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG]: ${message}`);
    }
  }

  private info(message: unknown) {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`[INFO]: ${message}`);
    }
  }

  private warn(message: unknown) {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN]: ${message}`);
    }
  }

  private error(message: unknown) {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR]: ${message}`);
    }
  }

  public connect = () => {
    this.debug('Connecting to socket');
    this.socket.connect();
  };

  public disconnect = (
    callback = () => this.info(`Succesfully disconnected from socket`)
  ) => {
    this.channels.clear();
    return this.socket.disconnect(callback);
  };

  private createChannel = (topic: string): Channel => {
    const channel = this.socket.channel(topic);
    channel
      .join()
      .receive('ok', () => this.info(`Successfully joined channel "${topic}"`))
      .receive('error', () => this.error(`Failed to join channel "${topic}"`));

    this.channels.set(topic, channel);
    return channel;
  };

  private getChannel = (topic: string): Channel => {
    let channel = this.channels.get(topic);
    if (!channel) {
      this.debug(`Creating channel for topic: "${topic}"`);
      channel = this.createChannel(topic);
    }
    return channel;
  };

  private on = <Payload, Event extends BaseStreamMessage<Payload>>(
    eventType: EventType,
    collectionSlug: string,
    callback: Callback<Event>
  ) => {
    this.socket.connect();

    const topic = collectionTopic(collectionSlug);
    this.debug(`Fetching channel ${topic}`);
    const channel = this.getChannel(topic);
    this.debug(`Subscribing to ${eventType} events on ${topic}`);
    channel.on(eventType, callback);
    return () => {
      this.debug(`Unsubscribing from ${eventType} events on ${topic}`);
      channel.leave().receive('ok', () => {
        this.channels.delete(topic);
        this.info(
          `Succesfully left channel "${topic}" listening for ${eventType}`
        );
      });
    };
  };

  public onItemMetadataUpdated = (
    collectionSlug: string,
    callback: Callback<ItemMetadataUpdate>
  ) => {
    this.debug(`Listening for item metadata updates on "${collectionSlug}"`);
    return this.on(EventType.ITEM_METADATA_UPDATED, collectionSlug, callback);
  };

  public onItemCancelled = (
    collectionSlug: string,
    callback: Callback<ItemCancelledEvent>
  ) => {
    this.debug(`Listening for item cancellations on "${collectionSlug}"`);
    return this.on(EventType.ITEM_CANCELLED, collectionSlug, callback);
  };

  public onItemListed = (
    collectionSlug: string,
    callback: Callback<ItemListedEvent>
  ) => {
    this.debug(`Listening for item listings on "${collectionSlug}"`);
    return this.on(EventType.ITEM_LISTED, collectionSlug, callback);
  };

  public onItemSold = (
    collectionSlug: string,
    callback: Callback<ItemSoldEvent>
  ) => {
    this.debug(`Listening for item sales on "${collectionSlug}"`);
    return this.on(EventType.ITEM_SOLD, collectionSlug, callback);
  };

  public onItemTransferred = (
    collectionSlug: string,
    callback: Callback<ItemTransferredEvent>
  ) => {
    this.debug(`Listening for item transfers on "${collectionSlug}"`);
    return this.on(EventType.ITEM_TRANSFERRED, collectionSlug, callback);
  };

  public onItemReceivedOffer = (
    collectionSlug: string,
    callback: Callback<ItemReceivedOfferEvent>
  ) => {
    this.debug(`Listening for item offers on "${collectionSlug}"`);
    return this.on(EventType.ITEM_RECEIVED_OFFER, collectionSlug, callback);
  };

  public onItemReceivedBid = (
    collectionSlug: string,
    callback: Callback<ItemReceivedBidEvent>
  ) => {
    this.debug(`Listening for item bids on "${collectionSlug}"`);
    return this.on(EventType.ITEM_RECEIVED_BID, collectionSlug, callback);
  };

  public onEvents = (
    collectionSlug: string,
    eventTypes: EventType[],
    callback: Callback<BaseStreamMessage<unknown>>
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
