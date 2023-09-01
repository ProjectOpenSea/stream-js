import type { SocketConnectOption } from 'phoenix';

export type OnClientEvent = <Payload>(
  collection: string,
  eventType: EventType,
  event: BaseStreamMessage<Payload>
) => boolean;

/**
 * OpenSea Stream API configuration object
 * @param token API key to use for API
 * @param network `Network` type to use. Defaults to `Network.MAINNET`
 * @param apiUrl Optional base URL to use for the API.
 * @param connectOptions `SocketConnectOption` type to use to connect to the Stream API socket.
 * @param onError a callback function to use whenever errors occur in the SDK.
 * @param logLevel `LogLevel` type to define the amount of logging the SDK should provide.
 * @param onEvent a callback function to use whenever an event is emmited in the SDK. Can be used to globally apply some logic, e.g emitting metric/logging etc. If the onEvent handler returns false, event will be filtered and the subscription callback won't be invoked.
 */
export type ClientConfig = {
  network?: Network;
  apiUrl?: string;
  token: string;
  connectOptions?: Partial<SocketConnectOption>;
  onError?: (error: unknown) => void;
  logLevel?: LogLevel;
  onEvent?: OnClientEvent;
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
  ITEM_CANCELLED = 'item_cancelled',
  COLLECTION_OFFER = 'collection_offer',
  TRAIT_OFFER = 'trait_offer',
  ORDER_INVALIDATE = 'order_invalidate',
  ORDER_REVALIDATE = 'order_revalidate'
}

interface BaseItemMetadataType {
  name: string | null;
  image_url: string | null;
  animation_url: string | null;
  metadata_url: string | null;
}

export type BaseItemType<Metadata = BaseItemMetadataType> = {
  nft_id: string;
  permalink: string;
  metadata: Metadata;
  chain: {
    name: string;
  };
};

export type Payload = {
  item: BaseItemType;
  collection: {
    slug: string;
  };
  chain: string;
};

export type BaseStreamMessage<Payload> = {
  event_type: string;
  sent_at: string;
  payload: Payload;
};

export type Trait = {
  trait_type: string;
  value: string | null;
  display_type: string | null;
  max_value: number | null;
  trait_count: number | null;
  order: number | null;
};

interface ExtendedItemMetadataType extends BaseItemMetadataType {
  description: string | null;
  backrgound_color: string | null;
  traits: Trait[];
}

export type ItemMetadataUpdatePayload = {
  collection: { slug: string };
  item: BaseItemType<ExtendedItemMetadataType>;
};

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
  order_hash: string;
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
  order_hash: string;
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
  order_hash: string;
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
  order_hash: string;
  base_price: string;
  payment_token: PaymentToken;
  event_timestamp: string;
}

export type ItemReceivedOfferEvent =
  BaseStreamMessage<ItemReceivedOfferEventPayload>;

export interface ItemCancelledEventPayload extends Payload {
  quantity: number;
  base_price: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  listing_type: string;
  listing_date: string;
  transaction: Transaction;
  payment_token: PaymentToken;
  order_hash: string;
  is_private: boolean;
  event_timestamp: string;
}

export type ItemCancelledEvent = BaseStreamMessage<ItemCancelledEventPayload>;

export interface CollectionOfferEventPayload extends Payload {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: string;
  order_hash: string;
  payment_token: PaymentToken;
  collection_criteria: object;
  asset_contract_criteria: object;
  event_timestamp: string;
}

export type CollectionOfferEvent =
  BaseStreamMessage<CollectionOfferEventPayload>;

export interface TraitOfferEventPayload extends Payload {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: string;
  order_hash: string;
  payment_token: PaymentToken;
  collection_criteria: object;
  asset_contract_criteria: object;
  trait_criteria: object;
  event_timestamp: string;
}

export type TraitOfferEvent = BaseStreamMessage<TraitOfferEventPayload>;

export interface OrderValidationEventPayload {
  event_timestamp: string;
  order_hash: string;
  protocol_address: string;
  chain: {
    name: string;
  };
  collection: {
    slug: string;
  };
}

export type OrderValidationEvent =
  BaseStreamMessage<OrderValidationEventPayload>;

export type Callback<Event> = (event: Event) => unknown;

export enum LogLevel {
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50
}
