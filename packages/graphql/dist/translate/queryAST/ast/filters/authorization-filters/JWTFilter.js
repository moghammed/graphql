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
exports.JWTFilter = void 0;
const Filter_1 = require("../Filter");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_comparison_operator_1 = require("../../../utils/create-comparison-operator");
class JWTFilter extends Filter_1.Filter {
    constructor({ operator, JWTClaim, comparisonValue, }) {
        super();
        this.operator = operator;
        this.JWTClaim = JWTClaim;
        this.comparisonValue = comparisonValue;
    }
    getChildren() {
        return [];
    }
    getPredicate(_context) {
        return (0, create_comparison_operator_1.createComparisonOperation)({
            operator: this.operator,
            property: this.JWTClaim,
            param: new cypher_builder_1.default.Param(this.comparisonValue),
        });
    }
    print() {
        return `${super.print()} <${this.operator} ${this.comparisonValue}>`;
    }
}
exports.JWTFilter = JWTFilter;
//# sourceMappingURL=JWTFilter.js.map