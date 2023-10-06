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
exports.PropertyFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("../Filter");
const create_comparison_operator_1 = require("../../../utils/create-comparison-operator");
class PropertyFilter extends Filter_1.Filter {
    constructor({ attribute, comparisonValue, operator, isNot, attachedTo, }) {
        super();
        this.attribute = attribute;
        this.comparisonValue = comparisonValue;
        this.operator = operator;
        this.isNot = isNot;
        this.attachedTo = attachedTo ?? "node";
    }
    getChildren() {
        return [];
    }
    print() {
        return `${super.print()} [${this.attachedTo}] <${this.isNot ? "NOT " : ""}${this.operator}>`;
    }
    getPredicate(queryASTContext) {
        const prop = this.getPropertyRef(queryASTContext);
        if (this.comparisonValue === null) {
            return this.getNullPredicate(prop);
        }
        const baseOperation = this.getOperation(prop);
        return this.wrapInNotIfNeeded(baseOperation);
    }
    getPropertyRef(queryASTContext) {
        if (this.attachedTo === "node") {
            return queryASTContext.target.property(this.attribute.databaseName);
        }
        else if (this.attachedTo === "relationship" && queryASTContext.relationship) {
            return queryASTContext.relationship.property(this.attribute.databaseName);
        }
        else {
            throw new Error("Transpilation error");
        }
    }
    /** Returns the operation for a given filter.
     * To be overridden by subclasses
     */
    getOperation(prop) {
        return this.createBaseOperation({
            operator: this.operator,
            property: prop,
            param: new cypher_builder_1.default.Param(this.comparisonValue),
        });
    }
    /** Returns the default operation for a given filter */
    createBaseOperation({ operator, property, param, }) {
        const coalesceProperty = this.coalesceValueIfNeeded(property);
        return (0, create_comparison_operator_1.createComparisonOperation)({ operator, property: coalesceProperty, param });
    }
    coalesceValueIfNeeded(expr) {
        if (this.attribute.annotations.coalesce) {
            const value = this.attribute.annotations.coalesce.value;
            const literal = new cypher_builder_1.default.Literal(value);
            return cypher_builder_1.default.coalesce(expr, literal);
        }
        return expr;
    }
    getNullPredicate(propertyRef) {
        if (this.isNot) {
            return cypher_builder_1.default.isNotNull(propertyRef);
        }
        else {
            return cypher_builder_1.default.isNull(propertyRef);
        }
    }
    wrapInNotIfNeeded(predicate) {
        if (this.isNot)
            return cypher_builder_1.default.not(predicate);
        else
            return predicate;
    }
}
exports.PropertyFilter = PropertyFilter;
//# sourceMappingURL=PropertyFilter.js.map