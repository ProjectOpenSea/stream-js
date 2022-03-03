import { Channel, Socket } from 'phoenix';
import { OpenSeaPushClient } from '../src';

export const getSocket = (sdk: OpenSeaPushClient): Socket => {
  // @ts-expect-error private access
  return sdk.socket;
};

export const getChannels = (sdk: OpenSeaPushClient): Map<string, Channel> => {
  // @ts-expect-error private access
  return sdk.channels;
};
