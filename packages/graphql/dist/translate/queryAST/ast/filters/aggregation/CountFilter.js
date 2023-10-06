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
exports.CountFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("../Filter");
class CountFilter extends Filter_1.Filter {
    constructor({ isNot, operator, comparisonValue, }) {
        super();
        this.comparisonValue = comparisonValue;
        this.operator = operator;
        this.isNot = isNot;
    }
    getPredicate(queryASTContext) {
        return this.createBaseOperation({
            operator: this.operator,
            expr: cypher_builder_1.default.count(queryASTContext.target),
            param: new cypher_builder_1.default.Param(this.comparisonValue),
        });
    }
    getChildren() {
        return [];
    }
    print() {
        return `${super.print()} <${this.isNot ? "NOT " : ""}${this.operator}>`;
    }
    /** Returns the default operation for a given filter */
    // NOTE: duplicate from property filter
    createBaseOperation({ operator, expr, param, }) {
        switch (operator) {
            case "LT":
                return cypher_builder_1.default.lt(expr, param);
            case "LTE":
                return cypher_builder_1.default.lte(expr, param);
            case "GT":
                return cypher_builder_1.default.gt(expr, param);
            case "GTE":
                return cypher_builder_1.default.gte(expr, param);
            case "ENDS_WITH":
                return cypher_builder_1.default.endsWith(expr, param);
            case "STARTS_WITH":
                return cypher_builder_1.default.startsWith(expr, param);
            case "MATCHES":
                return cypher_builder_1.default.matches(expr, param);
            case "CONTAINS":
                return cypher_builder_1.default.contains(expr, param);
            case "IN":
                return cypher_builder_1.default.in(expr, param);
            case "INCLUDES":
                return cypher_builder_1.default.in(param, expr);
            case "EQ":
                return cypher_builder_1.default.eq(expr, param);
            default:
                throw new Error(`Invalid operator ${operator}`);
        }
    }
}
exports.CountFilter = CountFilter;
//# sourceMappingURL=CountFilter.js.map