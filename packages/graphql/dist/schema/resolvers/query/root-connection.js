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
exports.rootConnectionResolver = void 0;
const graphql_1 = require("graphql");
const PageInfo_1 = require("../../../graphql/objects/PageInfo");
const translate_1 = require("../../../translate");
const utils_1 = require("../../../utils");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
const utils_2 = require("../../../utils/utils");
const pagination_1 = require("../../pagination");
const to_compose_1 = require("../../to-compose");
function rootConnectionResolver({ node, composer, concreteEntityAdapter, propagatedDirectives, }) {
    async function resolve(_root, args, context, info) {
        const resolveTree = (0, get_neo4j_resolve_tree_1.default)(info, { args });
        const edgeTree = resolveTree.fieldsByTypeName[`${concreteEntityAdapter.upperFirstPlural}Connection`]?.edges;
        const nodeTree = edgeTree?.fieldsByTypeName[`${concreteEntityAdapter.name}Edge`]?.node;
        const resolveTreeForContext = nodeTree || resolveTree;
        context.resolveTree = {
            ...resolveTreeForContext,
            args: resolveTree.args,
        };
        const { cypher, params } = (0, translate_1.translateRead)({
            context: context,
            node,
            isRootConnectionField: true,
        });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: "READ",
            context,
        });
        let totalCount = 0;
        let edges = [];
        let pageInfo = {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
        };
        if (executeResult.records[0]) {
            const record = executeResult.records[0].this;
            totalCount = (0, utils_2.isNeoInt)(record.totalCount) ? record.totalCount.toNumber() : record.totalCount;
            const connection = (0, pagination_1.createConnectionWithEdgeProperties)({
                selectionSet: resolveTree,
                source: { edges: record.edges },
                args: { first: args.first, after: args.after },
                totalCount,
            });
            // TODO: Question why are these not taking into account the potential aliases?
            edges = connection.edges;
            pageInfo = connection.pageInfo;
        }
        return {
            totalCount,
            edges,
            pageInfo,
        };
    }
    const rootEdge = composer.createObjectTC({
        name: `${concreteEntityAdapter.name}Edge`,
        fields: {
            cursor: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            node: `${concreteEntityAdapter.name}!`,
        },
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives),
    });
    const rootConnection = composer.createObjectTC({
        name: `${concreteEntityAdapter.upperFirstPlural}Connection`,
        fields: {
            totalCount: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
            pageInfo: new graphql_1.GraphQLNonNull(PageInfo_1.PageInfo),
            edges: rootEdge.NonNull.List.NonNull,
        },
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives),
    });
    // since sort is not created when there is nothing to sort, we check for its existence
    let sortArg;
    if (composer.has(concreteEntityAdapter.operations.sortInputTypeName)) {
        sortArg = composer.getITC(concreteEntityAdapter.operations.sortInputTypeName);
    }
    return {
        type: rootConnection.NonNull,
        resolve,
        args: {
            first: graphql_1.GraphQLInt,
            after: graphql_1.GraphQLString,
            where: concreteEntityAdapter.operations.whereInputTypeName,
            ...(sortArg ? { sort: sortArg.List } : {}),
            ...(concreteEntityAdapter.annotations.fulltext
                ? {
                    fulltext: {
                        type: concreteEntityAdapter.operations.fullTextInputTypeName,
                        description: "Query a full-text index. Allows for the aggregation of results, but does not return the query score. Use the root full-text query fields if you require the score.",
                    },
                }
                : {}),
        },
    };
}
exports.rootConnectionResolver = rootConnectionResolver;
//# sourceMappingURL=root-connection.js.map