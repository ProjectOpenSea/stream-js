import { SocketConnectOption } from 'phoenix';

export type ApiConfig = {
  apiUrl: string;
  socketOptions: Partial<SocketConnectOption>;
};

export enum EventType {
  ITEM_METADATA_UPDATED = 'item_metadata_updated',
  ITEM_LISTED = 'item_listed',
  ITEM_SOLD = 'item_sold',
  ITEM_TRANSFERRED = 'item_transferred',
  ITEM_RECEIVED_OFFER = 'item_received_offer',
  ITEM_RECEIVED_BID = 'item_received_bid'
}

export type BasePushedUpdateMessage = {
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
  payload: any;
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
export interface ItemMetadataUpdate extends BasePushedUpdateMessage {
  payload: ItemMetadataUpdatePayload;
}

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

export interface ItemListedEvent extends BasePushedUpdateMessage {
  payload: ItemListedEventPayload;
}

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

export interface ItemSoldEvent extends BasePushedUpdateMessage {
  payload: ItemSoldEventPayload;
}

export type ItemTransferredEventPayload = {
  from_account: Account;
  quantity: number;
  to_account: Account;
  transaction: Transaction;
};

export interface ItemTransferredEvent extends BasePushedUpdateMessage {
  payload: ItemTransferredEventPayload;
}

export type ItemReceivedBidEventPayload = {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: number;
  payment_token: PaymentToken;
};

export interface ItemReceivedBidEvent extends BasePushedUpdateMessage {
  payload: ItemReceivedBidEventPayload;
}

export type ItemReceivedOfferEventPayload = {
  quantity: number;
  created_date: string;
  expiration_date: string;
  maker: Account;
  taker: Account;
  base_price: number;
  payment_token: PaymentToken;
};

export interface ItemReceivedOfferEvent extends BasePushedUpdateMessage {
  payload: ItemReceivedOfferEventPayload;
}
