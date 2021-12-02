import { SocketConnectOption } from 'phoenix';

export type ApiConfig = {
  apiUrl: string;
  socketOptions: Partial<SocketConnectOption>;
};

export enum EventType {
  ITEM_METADATA_UPDATED = 'item_metadata_updated',
  ITEM_LISTED = 'item_listed',
  ITEM_SOLD = 'item_sold',
  ITEM_TRANSFERRED = 'item_transferred'
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
  timestamp: number;
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
  // TODO
  type: string;
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
  // TODO
  hash: string;
};
export type ItemSoldEventPayload = {
  quantity: number;
  listing_type: string;
  listing_date: string;
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
  // TODO
  something: string;
};

export interface ItemTransferredEvent extends BasePushedUpdateMessage {
  payload: ItemTransferredEventPayload;
}
