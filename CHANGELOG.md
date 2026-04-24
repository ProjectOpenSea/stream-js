# @opensea/stream-js

## 0.3.1

### Patch Changes

- cefd90d: Migrate default WebSocket endpoint from `wss://stream.openseabeta.com/socket` to `wss://stream-api.opensea.io/socket`. The new endpoint connects to the Kotlin stream API service which reads directly from Kafka, reducing event delivery latency. No protocol or API changes — existing client code works without modification.

## 0.3.0

### Minor Changes

- Add `version` field to `BaseStreamMessage` for out-of-order event resolution
