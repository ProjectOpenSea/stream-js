import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { collectionTopic } from "../src/helpers.js"
import {
  EventType,
  LogLevel,
  type OnClientEvent,
  OpenSeaStreamClient,
} from "../src/index.js"
import { encode, getChannels, getSocket, mockEvent } from "./helpers.js"
import { MockWS } from "./mock-ws.js"

let server: MockWS
let streamClient: OpenSeaStreamClient

const clientOpts = {
  token: "test",
  apiUrl: "ws://localhost:1234",
  logLevel: LogLevel.WARN,
}

beforeEach(() => {
  server = new MockWS("ws://localhost:1234")
})

afterEach(() => {
  server.close()
})

afterEach(() => {
  streamClient.disconnect()
})

test("constructor", async () => {
  streamClient = new OpenSeaStreamClient(clientOpts)

  const socket = getSocket(streamClient)
  expect(socket.protocol()).toBe("ws")
  expect(socket.endPointURL()).toBe(
    "ws://localhost:1234/websocket?token=test&vsn=2.0.0",
  )
  expect(socket.isConnected()).toBe(false)
})

describe("unsubscribe", () => {
  test("channel", () => {
    streamClient = new OpenSeaStreamClient(clientOpts)

    const unsubscribec1 = streamClient.onItemListed("c1", vi.fn())
    const unsubscribec2 = streamClient.onItemListed("c2", vi.fn())

    expect(Array.from(getChannels(streamClient).keys())).toEqual([
      "collection:c1",
      "collection:c2",
    ])

    unsubscribec1()
    expect(Array.from(getChannels(streamClient).keys())).toEqual([
      "collection:c2",
    ])

    unsubscribec2()
    expect(Array.from(getChannels(streamClient).keys())).toEqual([])
  })

  test("socket", () => {
    streamClient = new OpenSeaStreamClient(clientOpts)

    streamClient.onItemListed("c1", vi.fn())
    streamClient.onItemListed("c2", vi.fn())

    streamClient.disconnect()
    expect(Array.from(getChannels(streamClient).keys())).toEqual([])
  })
})

describe("event streams", () => {
  Object.values(EventType).forEach(eventType => {
    test(`${eventType}`, async () => {
      const collectionSlug = "c1"

      streamClient = new OpenSeaStreamClient({
        ...clientOpts,
        connectOptions: { transport: WebSocket },
      })

      // connection will fail as phoenix socket modified the endpoint url
      const socket = getSocket(streamClient)
      vi.spyOn(socket, "endPointURL").mockImplementation(
        () => "ws://localhost:1234",
      )

      const onItemListed = vi.fn()
      const unsubscribe = streamClient.onEvents(
        collectionSlug,
        [eventType],
        event => onItemListed(event),
      )

      const payload = mockEvent(eventType, {})

      server.send(
        encode({
          topic: collectionTopic(collectionSlug),
          event: eventType,
          payload,
        }),
      )

      expect(onItemListed).toBeCalledWith(payload)

      server.send(
        encode({
          topic: collectionTopic(collectionSlug),
          event: eventType,
          payload,
        }),
      )

      expect(onItemListed).toBeCalledTimes(2)

      unsubscribe()

      server.send(
        encode({
          topic: collectionTopic(collectionSlug),
          event: eventType,
          payload,
        }),
      )

      expect(onItemListed).toBeCalledTimes(2)
    })
  })
})

describe("middleware", () => {
  test("single", () => {
    const collectionSlug = "c1"

    const onClientEvent = vi
      .fn()
      .mockImplementation(() => true) as unknown as OnClientEvent

    streamClient = new OpenSeaStreamClient({
      ...clientOpts,
      connectOptions: { transport: WebSocket },
      onEvent: onClientEvent,
    })

    const socket = getSocket(streamClient)
    vi.spyOn(socket, "endPointURL").mockImplementation(
      () => "ws://localhost:1234",
    )

    const onEvent = vi.fn()

    const listingEvent = mockEvent(EventType.ITEM_LISTED, {})
    const saleEvent = mockEvent(EventType.ITEM_SOLD, {})

    streamClient.onEvents(
      collectionSlug,
      [EventType.ITEM_LISTED, EventType.ITEM_SOLD],
      event => onEvent(event),
    )

    server.send(
      encode({
        topic: collectionTopic(collectionSlug),
        event: EventType.ITEM_LISTED,
        payload: listingEvent,
      }),
    )

    server.send(
      encode({
        topic: collectionTopic(collectionSlug),
        event: EventType.ITEM_SOLD,
        payload: saleEvent,
      }),
    )

    expect(onClientEvent).nthCalledWith(
      1,
      collectionSlug,
      EventType.ITEM_LISTED,
      listingEvent,
    )

    expect(onClientEvent).nthCalledWith(
      2,
      collectionSlug,
      EventType.ITEM_SOLD,
      saleEvent,
    )

    expect(onEvent).nthCalledWith(1, listingEvent)
    expect(onEvent).nthCalledWith(2, saleEvent)

    streamClient.disconnect()
  })

  test("filter out events", () => {
    const collectionSlug = "c1"

    const onClientEvent = vi
      .fn()
      .mockImplementation(
        (_c: any, _e: any, event: any) =>
          event.payload.chain.name === "ethereum",
      ) as unknown as OnClientEvent

    streamClient = new OpenSeaStreamClient({
      ...clientOpts,
      connectOptions: { transport: WebSocket },
      onEvent: onClientEvent,
    })

    const socket = getSocket(streamClient)
    vi.spyOn(socket, "endPointURL").mockImplementation(
      () => "ws://localhost:1234",
    )

    const onEvent = vi.fn()

    const ethereumListing = mockEvent(EventType.ITEM_LISTED, {
      chain: { name: "ethereum" },
    })
    const polygonListing = mockEvent(EventType.ITEM_LISTED, {
      chain: { name: "polygon" },
    })

    streamClient.onEvents(
      collectionSlug,
      [EventType.ITEM_LISTED, EventType.ITEM_SOLD],
      event => onEvent(event),
    )

    server.send(
      encode({
        topic: collectionTopic(collectionSlug),
        event: EventType.ITEM_LISTED,
        payload: ethereumListing,
      }),
    )

    server.send(
      encode({
        topic: collectionTopic(collectionSlug),
        event: EventType.ITEM_SOLD,
        payload: polygonListing,
      }),
    )

    expect(onClientEvent).nthCalledWith(
      1,
      collectionSlug,
      EventType.ITEM_LISTED,
      ethereumListing,
    )

    expect(onClientEvent).nthCalledWith(
      2,
      collectionSlug,
      EventType.ITEM_SOLD,
      polygonListing,
    )

    expect(onEvent).toHaveBeenCalledTimes(1)
    expect(onEvent).toHaveBeenCalledWith(ethereumListing)

    streamClient.disconnect()
  })
})
