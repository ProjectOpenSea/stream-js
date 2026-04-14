/**
 * A vitest-compatible WebSocket mock server.
 * Replaces jest-websocket-mock by providing a fake WebSocket constructor
 * that captures connected clients so tests can send messages to them.
 */

type EventHandler = ((event: Event) => void) | null
type MessageHandler = ((event: MessageEvent) => void) | null

class FakeWebSocket extends EventTarget {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSING = 2
  static readonly CLOSED = 3

  readonly CONNECTING = 0
  readonly OPEN = 1
  readonly CLOSING = 2
  readonly CLOSED = 3

  readyState: number = FakeWebSocket.CONNECTING
  url: string
  protocol = ""
  extensions = ""
  bufferedAmount = 0
  binaryType: BinaryType = "blob"

  onopen: EventHandler = null
  onclose: EventHandler = null
  onerror: EventHandler = null
  onmessage: MessageHandler = null

  constructor(url: string | URL, _protocols?: string | string[]) {
    super()
    this.url = typeof url === "string" ? url : url.toString()

    // Simulate connection open synchronously so tests can send messages right away.
    // Use queueMicrotask so onopen/onmessage handlers set by phoenix are in place.
    queueMicrotask(() => {
      this.readyState = FakeWebSocket.OPEN
      const event = new Event("open")
      this.onopen?.(event)
      this.dispatchEvent(event)
    })
  }

  send(_data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    // no-op for testing
  }

  close(_code?: number, _reason?: string): void {
    this.readyState = FakeWebSocket.CLOSED
    const event = new CloseEvent("close")
    this.onclose?.(event)
    this.dispatchEvent(event)
  }

  /**
   * Simulate receiving a message (used by MockWS).
   */
  _receiveMessage(data: string) {
    const event = new MessageEvent("message", { data })
    this.onmessage?.(event)
    this.dispatchEvent(event)
  }
}

/** Registry of all FakeWebSocket instances, keyed by URL prefix */
const registry = new Map<string, FakeWebSocket[]>()

export class MockWS {
  private url: string
  private originalWebSocket: typeof WebSocket

  constructor(url: string) {
    this.url = url
    this.originalWebSocket = globalThis.WebSocket

    const serverUrl = url

    // Replace global WebSocket with our fake
    globalThis.WebSocket = class extends FakeWebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols)
        const urlStr = typeof url === "string" ? url : url.toString()
        // Register this client if its URL starts with the server URL
        if (urlStr.startsWith(serverUrl)) {
          const clients = registry.get(serverUrl) || []
          clients.push(this)
          registry.set(serverUrl, clients)
        }
      }
    } as unknown as typeof WebSocket

    // Copy static properties
    Object.defineProperty(globalThis.WebSocket, "CONNECTING", { value: 0 })
    Object.defineProperty(globalThis.WebSocket, "OPEN", { value: 1 })
    Object.defineProperty(globalThis.WebSocket, "CLOSING", { value: 2 })
    Object.defineProperty(globalThis.WebSocket, "CLOSED", { value: 3 })

    registry.set(url, [])
  }

  /**
   * Send a message to all connected clients.
   * Delivers regardless of readyState since the phoenix socket sets
   * onmessage immediately after creating the WebSocket.
   */
  send(data: string) {
    const clients = registry.get(this.url) || []
    for (const client of clients) {
      client._receiveMessage(data)
    }
  }

  /**
   * Close all connections and restore the original WebSocket.
   */
  close() {
    const clients = registry.get(this.url) || []
    for (const client of clients) {
      if (
        client.readyState === FakeWebSocket.OPEN ||
        client.readyState === FakeWebSocket.CONNECTING
      ) {
        client.close()
      }
    }
    registry.delete(this.url)
    globalThis.WebSocket = this.originalWebSocket
  }
}
