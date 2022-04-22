import type { Channel, Socket } from 'phoenix';
import { BaseStreamMessage, EventType, OpenSeaStreamClient } from '../src';

export const getSocket = (client: OpenSeaStreamClient): Socket => {
  // @ts-expect-error private access
  return client.socket;
};

export const getChannels = (
  client: OpenSeaStreamClient
): Map<string, Channel> => {
  // @ts-expect-error private access
  return client.channels;
};

type ChannelParams<Payload = unknown> = {
  join_ref?: string;
  ref?: string;
  topic: string;
  event: EventType;
  payload: BaseStreamMessage<Payload>;
};

export const encode = ({
  join_ref,
  ref,
  topic,
  event,
  payload
}: ChannelParams) => {
  return JSON.stringify([join_ref, ref, topic, event, payload]);
};

export const mockEVMEvent = <Payload = unknown>(
  eventType: EventType,
  payload: Payload
): BaseStreamMessage<Payload> => {
  return {
    collection: {
      slug: 'bored-ape'
    },
    event_type: eventType,
    item: {
      contract_address: '0x',
      token_id: '11',
      permalink: 'https://opensea.io/assets/11',
      item_metadata: {
        name: 'Bored Ape #11',
        image_url: 'https://example.com/image.png',
        animation_url: 'https://example.com/image.png',
        metadata_url: 'https://example.com/image.png'
      },
      chain: {
        name: 'Ethereum'
      }
    },
    payload,
    timestamp: Date.now().toString()
  };
};

export const mockSolanaEvent = <Payload = unknown>(
  eventType: EventType,
  payload: Payload
): BaseStreamMessage<Payload> => {
  return {
    collection: {
      slug: 'bored-ape'
    },
    event_type: eventType,
    item: {
      mint_address: '0x',
      permalink: 'https://opensea.io/assets/11',
      item_metadata: {
        name: 'Bored Ape #11',
        image_url: 'https://example.com/image.png',
        animation_url: 'https://example.com/image.png',
        metadata_url: 'https://example.com/image.png'
      },
      chain: {
        name: 'Ethereum'
      }
    },
    payload,
    timestamp: Date.now().toString()
  };
};
