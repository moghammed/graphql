"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jGraphQLAMQPSubscriptionsEngine = void 0;
const events_1 = require("events");
const amqp_0_9_1_api_1 = require("./amqp-0-9-1-api");
const DEFAULT_EXCHANGE = "neo4j.graphql.subscriptions.fx";
const DEFAULT_VERSION = "0-9-1";
class Neo4jGraphQLAMQPSubscriptionsEngine {
    constructor(options) {
        const defaultOptions = { exchange: DEFAULT_EXCHANGE, amqpVersion: DEFAULT_VERSION, log: true };
        const finalOptions = { ...defaultOptions, ...options };
        this.events = new events_1.EventEmitter();
        this.amqpApi = new amqp_0_9_1_api_1.AmqpApi({
            exchange: finalOptions.exchange,
            reconnectTimeout: finalOptions.reconnectTimeout,
            log: finalOptions.log,
        });
        this.connectionOptions = options.connection;
    }
    init() {
        return this.amqpApi.connect(this.connectionOptions, (message) => {
            this.events.emit(message.event, message);
        });
    }
    /* Closes the connection and unbinds the event emitter */
    close() {
        this.events.removeAllListeners();
        return this.amqpApi.close();
    }
    publish(eventMeta) {
        this.amqpApi.publish(eventMeta);
        return Promise.resolve(); // To avoid future breaking changes, we always return a promise
    }
}
exports.Neo4jGraphQLAMQPSubscriptionsEngine = Neo4jGraphQLAMQPSubscriptionsEngine;
//# sourceMappingURL=index.js.map