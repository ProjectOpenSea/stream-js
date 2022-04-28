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

export const mockEvent = <Payload = unknown>(
  eventType: EventType,
  payload: Payload
): BaseStreamMessage<Payload> => {
  return {
    event_type: eventType,
    payload,
    sent_at: Date.now().toString()
  };
};
