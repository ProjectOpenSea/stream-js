import type { Channel, Socket } from 'phoenix';
import { BasePushedUpdateMessage, EventType, OpenSeaPushClient } from '../src';

export const getSocket = (client: OpenSeaPushClient): Socket => {
  // @ts-expect-error private access
  return client.socket;
};

export const getChannels = (
  client: OpenSeaPushClient
): Map<string, Channel> => {
  // @ts-expect-error private access
  return client.channels;
};

type ChannelParams<Payload = unknown> = {
  join_ref?: string;
  ref?: string;
  topic: string;
  event: EventType;
  payload: BasePushedUpdateMessage<Payload>;
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

export const mockEvent = <Payload = unknown>(
  eventType: EventType,
  payload: Payload
): BasePushedUpdateMessage<Payload> => {
  return {
    chain: {
      name: 'Ethereum'
    },
    collection: {
      slug: 'bored-ape'
    },
    event_type: eventType,
    item: {
      contract_address: '0x',
      token_id: '11'
    },
    payload,
    timestamp: Date.now().toString()
  };
};
