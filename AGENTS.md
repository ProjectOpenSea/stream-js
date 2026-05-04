# stream — Agent Conventions

WebSocket client for real-time OpenSea marketplace event streaming via the Stream API (Phoenix Channels).

## Quick Reference

```bash
cd packages/stream
pnpm install
pnpm run build         # Build with tsup
pnpm run test          # Run tests with Vitest
pnpm run lint          # Lint with Biome
pnpm run format        # Format with Biome
pnpm run check-types   # TypeScript type checking
```

## Architecture

| File | Role |
|------|------|
| `src/client.ts` | `OpenSeaStreamClient` — main class managing Socket connection, channels, and event subscriptions |
| `src/types.ts` | All public types: `ClientConfig`, `EventType` enum, event payload interfaces (`ItemListedEvent`, `ItemSoldEvent`, etc.) |
| `src/constants.ts` | WebSocket endpoints per network |
| `src/helpers.ts` | Topic construction for Phoenix channel subscriptions |
| `src/index.ts` | Public exports |
| `test/client.spec.ts` | Unit tests with mock WebSocket |
| `test/mock-ws.ts` | Mock WebSocket server for testing |

## Review Checklist

When reviewing changes to this package, verify:

1. **Event type completeness**: The `EventType` enum in `src/types.ts` must match the events published by the Stream API backend (`pushed-updates`). When a new event type is added server-side, add it to the enum and create a corresponding payload interface and `on*` method in `client.ts`.

2. **Phoenix protocol compatibility**: The client uses the `phoenix` npm package for WebSocket multiplexing. Changes to channel join/leave logic must respect Phoenix channel lifecycle (join → receive ok/error → on events → leave).

3. **`BaseStreamMessage` shape**: All event payloads extend `BaseStreamMessage<Payload>` which includes `event_type`, `version`, `sent_at`, and `payload`. Do not change this base shape without coordinating with the backend.

4. **Browser and Node compatibility**: The client detects `window.WebSocket` for browser environments and allows custom transport via `connectOptions`. Changes must not break either environment.

5. **Unsubscribe cleanup**: Each `on*` method returns an unsubscribe function that calls `channel.leave()` and removes the channel from the internal map. Verify new subscription methods follow this pattern.

## Conventions

- ESM-only (`"type": "module"`). Use `.js` extensions in import paths.
- Dual CJS/ESM output via tsup.
- Biome for linting and formatting (config at monorepo root).
- The client auto-connects the socket on the first `on*` call — no need to call `connect()` explicitly.
- Collection slugs are the primary subscription key (one Phoenix channel per collection).
- `Network.MAINNET` is the only supported network. The `apiUrl` config option allows custom endpoints.
