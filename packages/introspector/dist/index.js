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
exports.toGraphQLTypeDefs = exports.toGenericStruct = exports.graphqlFormatter = void 0;
const neo4j_graphql_1 = __importDefault(require("./transforms/neo4j-graphql"));
exports.graphqlFormatter = neo4j_graphql_1.default;
const to_internal_struct_1 = __importDefault(require("./to-internal-struct"));
async function toGenericStruct(sessionFactory) {
    return (0, to_internal_struct_1.default)(sessionFactory);
}
exports.toGenericStruct = toGenericStruct;
async function toGraphQLTypeDefs(sessionFactory, readonly = false) {
    const genericStruct = await toGenericStruct(sessionFactory);
    return (0, neo4j_graphql_1.default)(genericStruct, readonly);
}
exports.toGraphQLTypeDefs = toGraphQLTypeDefs;
//# sourceMappingURL=index.js.map