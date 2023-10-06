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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDCApi = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("../../../utils/utils");
class CDCApi {
    constructor(driver) {
        this.lastChangeId = "";
        this.driver = driver;
    }
    async queryEvents() {
        if (!this.lastChangeId) {
            this.lastChangeId = await this.fetchCurrentChangeId();
        }
        const lastChangeIdLiteral = new cypher_builder_1.default.Literal(this.lastChangeId);
        const queryProcedure = CDCProcedures.query(lastChangeIdLiteral).yield("id", "event");
        const events = await this.runProcedure(queryProcedure);
        this.updateChangeIdWithLastEvent(events);
        return events.map((query) => query.event);
    }
    async fetchCurrentChangeId() {
        const currentProcedure = CDCProcedures.current();
        const result = await this.runProcedure(currentProcedure);
        if (result[0] && result[0].id) {
            return result[0].id;
        }
        else {
            throw new Error("id not available on cdc.current");
        }
    }
    updateChangeIdWithLastEvent(events) {
        const lastEvent = events[events.length - 1];
        if (lastEvent) {
            this.lastChangeId = lastEvent.id;
        }
    }
    async runProcedure(procedure) {
        const { cypher, params } = procedure.build();
        const result = await this.driver.executeQuery(cypher, params);
        return result.records.map((record) => {
            return record.toObject();
        });
    }
}
exports.CDCApi = CDCApi;
/** Wrapper of Cypher Builder for CDC */
class CDCProcedures {
    static current() {
        return new cypher_builder_1.default.Procedure("cdc.current");
    }
    static query(from, selectors) {
        const procedureParams = (0, utils_1.filterTruthy)([from, selectors]);
        return new cypher_builder_1.default.Procedure("cdc.query", procedureParams);
    }
}
//# sourceMappingURL=cdc-api.js.map