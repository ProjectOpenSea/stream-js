import type { SocketConnectOption } from 'phoenix';

/**
 * OpenSea Stream API configuration object
 * @param token API key to use for API
 * @param network `Network` type to use. Defaults to `Network.MAINNET`
 * @param apiUrl Optional base URL to use for the API.
 * @param connectOptions `SocketConnectOption` type to use to connect to the Stream API socket.
 * @param onError a callback function to use whenever errors occur in the SDK.
 * @param logLevel `LogLevel` type to define the amount of logging the SDK should provide.
 */
export type ClientConfig = {
  network?: Network;
  apiUrl?: string;
  token: string;
  connectOptions?: Partial<SocketConnectOption>;
  onError?: (error: unknown) => void;
  logLevel?: LogLevel;
};

export enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet'
}

export enum EventType {
  ITEM_METADATA_UPDATED = 'item_metadata_updated',
  ITEM_LISTED = 'item_listed',
  ITEM_SOLD = 'item_sold',
  ITEM_TRANSFERRED = 'item_transferred',
  ITEM_RECEIVED_OFFER = 'item_received_offer',
  ITEM_RECEIVED_BID = 'item_received_bid',
  ITEM_CANCELLED = 'item_cancelled'
}

export type BaseItemType = {
  nft_id: string;
  permalink: string;
  metadata: BaseItemMetadataType;
  chain: {
    name: string;
  };
};

export type Payload = {
  item: BaseItemType;
  collection: {
    slug: string;
  };
};

export type BaseStreamMessage<Payload> = {
  event_type: string;
  sent_at: string;
  payload: Payload;
};

export type Trait = {
  trait_type: string;
  value: string;
  display_type: string;
  max_value: number;
  trait_count: string;
  order: number;
};

export interface BaseItemMetadataType extends Payload {
  name: string;
  image_url: string;
  animation_url: string;
  metadata_url: string;
}

export interface ItemMetadataUpdatePayload extends BaseItemMetadataType {
  description: string;
  background_color: string;
  traits: [Trait];
}
export type ItemMetadataUpdate = BaseStreamMessage<ItemMetadataUpdatePayload>;

export type Account = {
  address: string;
};

export type PaymentToken = {
  address: string;
  decimals: number;
  eth_price: string;
  name: string;
  symbol: string;
  usd_price: string;
};

export interface ItemListedEventPayload extends Payload {
  quantity: number;
  listing_type: string;
  listing_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: string;
  payment_token: PaymentToken;
  is_private: boolean;
  event_timestamp: string;
}

export type ItemListedEvent = BaseStreamMessage<ItemListedEventPayload>;

export type Transaction = {
  hash: string;
  timestamp: string;
};

export interface ItemSoldEventPayload extends Payload {
  quantity: number;
  listing_type: string;
  closing_date: string;
  transaction: Transaction;
  maker: Account;
  taker: Account;
  sale_price: string;
  payment_token: PaymentToken;
  is_private: boolean;
  event_timestamp: string;
}

export type ItemSoldEvent = BaseStreamMessage<ItemSoldEventPayload>;

export interface ItemTransferredEventPayload extends Payload {
  from_account: Account;
  quantity: number;
  to_account: Account;
  transaction: Transaction;
  event_timestamp: string;
}

export type ItemTransferredEvent =
  BaseStreamMessage<ItemTransferredEventPayload>;

export interface ItemReceivedBidEventPayload extends Payload {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: string;
  payment_token: PaymentToken;
  event_timestamp: string;
}

export type ItemReceivedBidEvent =
  BaseStreamMessage<ItemReceivedBidEventPayload>;

export interface ItemReceivedOfferEventPayload extends Payload {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: string;
  payment_token: PaymentToken;
  event_timestamp: string;
}

export type ItemReceivedOfferEvent =
  BaseStreamMessage<ItemReceivedOfferEventPayload>;

export interface ItemCancelledEventPayload extends Payload {
  quantity: number;
  listing_type: string;
  transaction: Transaction;
  payment_token: PaymentToken;
  event_timestamp: string;
}

export type ItemCancelledEvent = BaseStreamMessage<ItemCancelledEventPayload>;

export type Callback<Event> = (event: Event) => unknown;

export enum LogLevel {
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50
}
