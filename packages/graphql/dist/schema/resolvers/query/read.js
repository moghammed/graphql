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
exports.findResolver = void 0;
const translate_1 = require("../../../translate");
const utils_1 = require("../../../utils");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
function findResolver({ node, concreteEntityAdapter, }) {
    async function resolve(_root, args, context, info) {
        const resolveTree = (0, get_neo4j_resolve_tree_1.default)(info, { args });
        context.resolveTree = resolveTree;
        const { cypher, params } = (0, translate_1.translateRead)({ context: context, node });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: "READ",
            context,
            info,
        });
        return executeResult.records.map((x) => x.this);
    }
    return {
        type: `[${concreteEntityAdapter.name}!]!`,
        resolve,
        args: {
            where: concreteEntityAdapter.operations.whereInputTypeName,
            options: concreteEntityAdapter.operations.optionsInputTypeName,
            ...(concreteEntityAdapter.annotations.fulltext
                ? {
                    fulltext: {
                        type: `${concreteEntityAdapter.name}Fulltext`,
                        description: "Query a full-text index. Allows for the aggregation of results, but does not return the query score. Use the root full-text query fields if you require the score.",
                    },
                }
                : {}),
        },
    };
}
exports.findResolver = findResolver;
//# sourceMappingURL=read.js.map