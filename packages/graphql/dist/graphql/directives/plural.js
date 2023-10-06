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
exports.pluralDirective = void 0;
const graphql_1 = require("graphql");
exports.pluralDirective = new graphql_1.GraphQLDirective({
    name: "plural",
    description: "Instructs @neo4j/graphql to use the given value as the plural of the type name",
    locations: [graphql_1.DirectiveLocation.OBJECT],
    args: {
        value: {
            description: "The value to use as the plural of the type name.",
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
    },
});
//# sourceMappingURL=plural.js.map