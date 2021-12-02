"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.OpenSeaPushClient = void 0;
var phoenix_1 = require("phoenix");
var types_1 = require("./types");
var ws_1 = require("ws");
var ALL = '*';
var OpenSeaPushClient = /** @class */ (function () {
    function OpenSeaPushClient(apiToken, _a) {
        var apiUrl = _a.apiUrl, socketOptions = _a.socketOptions;
        var opts = __assign({ params: {
                token: apiToken
            } }, socketOptions);
        this.socket = new phoenix_1.Socket(apiUrl, opts);
        this.socket.onError(function (e) {
            console.log(e);
        });
        this.socket.connect();
        this.channels = new Map();
    }
    OpenSeaPushClient.prototype.subscribe_item_metadata_updates = function (collection_slug, callback) {
        if (collection_slug === void 0) { collection_slug = ALL; }
        this.subscribe(types_1.EventType.ITEM_METADATA_UPDATED, collection_slug, callback);
    };
    OpenSeaPushClient.prototype.subscribe_item_listed_events = function (collection_slug, callback) {
        if (collection_slug === void 0) { collection_slug = ALL; }
        this.subscribe(types_1.EventType.ITEM_LISTED, collection_slug, callback);
    };
    OpenSeaPushClient.prototype.subscribe_item_sold_events = function (collection_slug, callback) {
        if (collection_slug === void 0) { collection_slug = ALL; }
        this.subscribe(types_1.EventType.ITEM_SOLD, collection_slug, callback);
    };
    OpenSeaPushClient.prototype.subscribe_item_transferred_events = function (collection_slug, callback) {
        if (collection_slug === void 0) { collection_slug = ALL; }
        this.subscribe(types_1.EventType.ITEM_TRANSFERRED, collection_slug, callback);
    };
    OpenSeaPushClient.prototype.subscribe_all_item_events = function (collection_slug, callback) {
        if (collection_slug === void 0) { collection_slug = ALL; }
        this.subscribe_item_listed_events(collection_slug, callback);
        this.subscribe_item_sold_events(collection_slug, callback);
        this.subscribe_item_transferred_events(collection_slug, callback);
    };
    OpenSeaPushClient.prototype.subscribe = function (event_type, collection_slug, callback) {
        var topic = 'collection:' + collection_slug;
        var channel = this.get_channel(topic);
        channel.on(event_type, callback);
    };
    OpenSeaPushClient.prototype.get_channel = function (topic) {
        var channel = this.channels.get(topic);
        if (channel != undefined) {
            return channel;
        }
        channel = this.socket.channel(topic);
        channel
            .join()
            .receive('ok', function (_a) {
            var messages = _a.messages;
            return console.log('Successfully joined channel', messages || '');
        })
            .receive('error', function (_a) {
            var reason = _a.reason;
            return console.error('Failed to join channel', reason);
        });
        this.channels.set(topic, channel);
        return channel;
    };
    return OpenSeaPushClient;
}());
exports.OpenSeaPushClient = OpenSeaPushClient;
var client = new OpenSeaPushClient('', {
    apiUrl: 'ws://127.0.0.1:4000/socket',
    socketOptions: {
        transport: ws_1.WebSocket
    }
});
// client.subscribe_item_listed_events('untitled-collection-3067283', (a) => {
//   console.log(a);
//   return a;
// });
client.subscribe_item_listed_events('untitled-collection-2881457', function (a) {
    console.log(a);
    return a;
});
client.subscribe_item_sold_events('untitled-collection-2881457', function (a) {
    console.log(a);
    return a;
});
// client.subscribe_item_listed_events('*', (a) => {
//   console.log(a);
//   return a;
// });
// client.subscribe_item_sold_events('untitled-collection-3067283', (a) => {
//   console.log(a);
//   return a;
// });
// client.subscribe_item_sold_events('*', (a) => {
//   console.log(a);
//   return a;
// });
// client.subscribe_item_transferred_events('untitled-collection-3067283', (a) => {
//   console.log(a);
//   return a;
// });
// cl
