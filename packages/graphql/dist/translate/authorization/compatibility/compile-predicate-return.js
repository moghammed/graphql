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
exports.compilePredicateReturn = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const compile_cypher_1 = require("../../../utils/compile-cypher");
/**
 * Compiles Cypher, parameters and subqueries in the same Cypher Builder environment.
 *
 * The subqueries contain variables required by the predicate, and if they are not compiled with the same
 * environment, the predicate will be referring to non-existent variables and will re-assign variable from the subqueries.
 */
function compilePredicateReturn(predicateReturn) {
    const result = { cypher: "", params: {} };
    const { predicate, preComputedSubqueries } = predicateReturn;
    let subqueries;
    if (predicate) {
        const predicateCypher = new cypher_builder_1.default.RawCypher((env) => {
            const predicateStr = (0, compile_cypher_1.compileCypher)(predicate, env);
            if (preComputedSubqueries && !preComputedSubqueries.empty) {
                // Assign the Cypher string to a variable outside of the scope of the compilation
                subqueries = (0, compile_cypher_1.compileCypher)(preComputedSubqueries, env);
            }
            return predicateStr;
        });
        const { cypher, params } = predicateCypher.build("authorization_");
        result.cypher = cypher;
        result.params = params;
        result.subqueries = subqueries;
    }
    return result;
}
exports.compilePredicateReturn = compilePredicateReturn;
//# sourceMappingURL=compile-predicate-return.js.map