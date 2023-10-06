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
exports.createParameterWhere = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("./utils");
const create_comparison_operation_1 = require("./property-operations/create-comparison-operation");
/** Translates a property into its predicate filter */
function createParameterWhere({ key, value, context, }) {
    const match = utils_1.whereRegEx.exec(key);
    if (!match) {
        throw new Error(`Failed to match key in filter: ${key}`);
    }
    const { fieldName, operator } = match?.groups;
    if (!fieldName) {
        throw new Error(`Failed to find field name in filter: ${key}`);
    }
    if (!operator) {
        throw new Error(`Failed to find operator in filter: ${key}`);
    }
    // TODO: this is specific to authorization,
    // but this function has arguments which would indicate it should be generic
    const mappedJwtClaim = context.authorization.claims?.get(fieldName);
    let target;
    if (mappedJwtClaim) {
        // TODO: validate browser compatibility for Toolbox (https://caniuse.com/?search=Lookbehind)
        let paths = mappedJwtClaim.split(/(?<!\\)\./);
        paths = paths.map((p) => p.replaceAll(/\\\./g, "."));
        target = context.authorization.jwtParam.property(...paths);
    }
    else {
        target = context.authorization.jwtParam.property(fieldName);
    }
    const isNot = operator.startsWith("NOT") ?? false;
    const comparisonOp = (0, create_comparison_operation_1.createBaseOperation)({
        target,
        value: new cypher_builder_1.default.Param(value),
        operator,
    });
    if (isNot) {
        return cypher_builder_1.default.not(comparisonOp);
    }
    return comparisonOp;
}
exports.createParameterWhere = createParameterWhere;
//# sourceMappingURL=create-parameter-where.js.map