# @opensea/stream-js

## 0.4.0

### Minor Changes

- 4ff61ae: Add server-side event type filtering support. The `onEvents` method now passes `event_types` array in Phoenix channel join params, enabling the backend to filter events at subscription time. Individual `on*` methods remain backward-compatible.

## 0.3.1

### Patch Changes

- cefd90d: Migrate default WebSocket endpoint from `wss://stream.openseabeta.com/socket` to `wss://stream-api.opensea.io/socket`. The new endpoint connects to the Kotlin stream API service which reads directly from Kafka, reducing event delivery latency. No protocol or API changes — existing client code works without modification.

## 0.3.0

### Minor Changes

- Add `version` field to `BaseStreamMessage` for out-of-order event resolution
