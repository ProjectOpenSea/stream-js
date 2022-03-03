import type { SocketConnectOption } from 'phoenix';

export type ClientConfig = {
  apiUrl: string;
  token: string;
  connectOptions: Partial<SocketConnectOption>;
  onError?: (error: unknown) => void;
};

export enum EventType {
  ITEM_METADATA_UPDATED = 'item_metadata_updated',
  ITEM_LISTED = 'item_listed',
  ITEM_SOLD = 'item_sold',
  ITEM_TRANSFERRED = 'item_transferred',
  ITEM_RECEIVED_OFFER = 'item_received_offer',
  ITEM_RECEIVED_BID = 'item_received_bid',
  ITEM_CANCELLED = 'item_cancelled'
}

export type BasePushedUpdateMessage<Payload> = {
  item: {
    token_id: string;
    contract_address: string;
  };
  collection: {
    slug: string;
  };
  chain: {
    name: string;
  };
  event_type: string;
  timestamp: string;
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

export type ItemMetadataUpdatePayload = {
  name: string;
  description: string;
  image_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_original_url: string;
  animation_url: string;
  animation_original_url: string;
  background_color: string;
  metadata_url: string;
  traits: [Trait];
};
export type ItemMetadataUpdate =
  BasePushedUpdateMessage<ItemMetadataUpdatePayload>;

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

export type ItemListedEventPayload = {
  quantity: number;
  listing_type: string;
  listing_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: number;
  payment_token: PaymentToken;
  is_private: boolean;
};

export type ItemListedEvent = BasePushedUpdateMessage<ItemListedEventPayload>;

export type Transaction = {
  hash: string;
  timestamp: string;
};

export type ItemSoldEventPayload = {
  quantity: number;
  listing_type: string;
  closing_date: string;
  transaction: Transaction;
  maker: Account;
  taker: Account;
  sale_price: number;
  payment_token: PaymentToken;
  is_private: boolean;
};

export type ItemSoldEvent = BasePushedUpdateMessage<ItemSoldEventPayload>;

export type ItemTransferredEventPayload = {
  from_account: Account;
  quantity: number;
  to_account: Account;
  transaction: Transaction;
};

export type ItemTransferredEvent =
  BasePushedUpdateMessage<ItemTransferredEventPayload>;

export type ItemReceivedBidEventPayload = {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: number;
  payment_token: PaymentToken;
};

export type ItemReceivedBidEvent =
  BasePushedUpdateMessage<ItemReceivedBidEventPayload>;

export type ItemReceivedOfferEventPayload = {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: number;
  payment_token: PaymentToken;
};

export type ItemReceivedOfferEvent =
  BasePushedUpdateMessage<ItemReceivedOfferEventPayload>;

export type ItemCancelledEventPayload = {
  quantity: number;
  listing_type: string;
  transaction: Transaction;
  payment_token: PaymentToken;
};

export type ItemCancelledEvent =
  BasePushedUpdateMessage<ItemCancelledEventPayload>;

export type Callback<Event> = (event: Event) => unknown;
