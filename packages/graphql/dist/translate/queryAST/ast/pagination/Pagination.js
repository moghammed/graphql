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
exports.Pagination = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const neo4j_driver_1 = require("neo4j-driver");
const QueryASTNode_1 = require("../QueryASTNode");
class Pagination extends QueryASTNode_1.QueryASTNode {
    constructor({ skip, limit }) {
        super();
        this.skip = this.toNeo4jInt(skip);
        this.limit = this.toNeo4jInt(limit);
    }
    getPagination() {
        return {
            skip: this.skip ? new cypher_builder_1.default.Param(this.skip) : undefined,
            limit: this.limit ? new cypher_builder_1.default.Param(this.limit) : undefined,
        };
    }
    getChildren() {
        return [];
    }
    toNeo4jInt(n) {
        if (typeof n === "number") {
            return (0, neo4j_driver_1.int)(n);
        }
        return n;
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map