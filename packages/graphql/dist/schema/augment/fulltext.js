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
exports.augmentFulltextSchema = void 0;
const graphql_1 = require("graphql");
const fulltext_input_1 = require("../generation/fulltext-input");
const fulltext_1 = require("../resolvers/query/fulltext");
function augmentFulltextSchema(node, composer, concreteEntityAdapter) {
    if (!concreteEntityAdapter.annotations.fulltext) {
        return;
    }
    (0, fulltext_input_1.withFullTextInputType)({ concreteEntityAdapter, composer });
    (0, fulltext_input_1.withFullTextWhereInputType)({ composer, concreteEntityAdapter });
    /**
     * TODO [fulltext-deprecations]
     * to move this over to the concreteEntityAdapter we need to check what the use of
     * the queryType and scoreVariable properties are in FulltextContext
     *  and determine if we can remove them
     */
    concreteEntityAdapter.annotations.fulltext.indexes.forEach((index) => {
        /**
         * TODO [fulltext-deprecations]
         * remove indexName assignment and undefined check once the name argument has been removed.
         */
        const indexName = index.indexName || index.name;
        if (indexName === undefined) {
            throw new Error("The name of the fulltext index should be defined using the indexName argument.");
        }
        let queryName = concreteEntityAdapter.operations.getFullTextIndexQueryFieldName(indexName);
        if (index.queryName) {
            queryName = index.queryName;
        }
        /**
         * TODO [translation-layer-compatibility]
         *  temporary for compatibility with translation layer
         */
        const nodeIndex = node.fulltextDirective.indexes.find((i) => {
            const iName = i.indexName || i.name;
            return iName === indexName;
        });
        if (!nodeIndex) {
            throw new Error(`Could not find index ${indexName} on node ${node.name}`);
        }
        composer.Query.addFields({
            [queryName]: {
                type: (0, fulltext_input_1.withFullTextResultType)({ composer, concreteEntityAdapter }).NonNull.List.NonNull,
                description: "Query a full-text index. This query returns the query score, but does not allow for aggregations. Use the `fulltext` argument under other queries for this functionality.",
                resolve: (0, fulltext_1.fulltextResolver)({ node, index: nodeIndex }),
                args: {
                    phrase: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    where: concreteEntityAdapter.operations.fulltextTypeNames.where,
                    sort: (0, fulltext_input_1.withFullTextSortInputType)({ concreteEntityAdapter, composer }).NonNull.List,
                    limit: graphql_1.GraphQLInt,
                    offset: graphql_1.GraphQLInt,
                },
            },
        });
    });
}
exports.augmentFulltextSchema = augmentFulltextSchema;
//# sourceMappingURL=fulltext.js.map