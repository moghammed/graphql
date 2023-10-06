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
exports.mutationDirective = exports.MutationOperations = void 0;
const graphql_1 = require("graphql");
var MutationOperations;
(function (MutationOperations) {
    MutationOperations["CREATE"] = "CREATE";
    MutationOperations["UPDATE"] = "UPDATE";
    MutationOperations["DELETE"] = "DELETE";
})(MutationOperations || (exports.MutationOperations = MutationOperations = {}));
const MUTATION_FIELDS = new graphql_1.GraphQLEnumType({
    name: "MutationFields",
    values: {
        [MutationOperations.CREATE]: { value: MutationOperations.CREATE },
        [MutationOperations.UPDATE]: { value: MutationOperations.UPDATE },
        [MutationOperations.DELETE]: { value: MutationOperations.DELETE },
    },
});
exports.mutationDirective = new graphql_1.GraphQLDirective({
    name: "mutation",
    description: "Instructs @neo4j/graphql to exclude create, delete or update operations from the mutation root type.",
    args: {
        operations: {
            description: "Describe operations available for this type",
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(MUTATION_FIELDS)),
            defaultValue: [MutationOperations.CREATE, MutationOperations.UPDATE, MutationOperations.DELETE],
        },
    },
    locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.SCHEMA],
});
//# sourceMappingURL=mutation.js.map