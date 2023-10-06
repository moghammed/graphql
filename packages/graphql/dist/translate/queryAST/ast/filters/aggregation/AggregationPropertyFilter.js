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
exports.AggregationPropertyFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("../Filter");
class AggregationPropertyFilter extends Filter_1.Filter {
    constructor({ attribute, logicalOperator, comparisonValue, aggregationOperator, attachedTo, }) {
        super();
        this.attribute = attribute;
        this.comparisonValue = comparisonValue;
        this.logicalOperator = logicalOperator;
        this.aggregationOperator = aggregationOperator;
        this.attachedTo = attachedTo ?? "node";
    }
    getChildren() {
        return [];
    }
    getPredicate(queryASTContext) {
        const comparisonVar = new cypher_builder_1.default.Variable();
        const property = this.getPropertyRef(queryASTContext);
        if (this.aggregationOperator) {
            let propertyExpr = property;
            if (this.attribute.typeHelper.isString()) {
                propertyExpr = cypher_builder_1.default.size(property);
            }
            const aggrOperation = this.getAggregateOperation(propertyExpr, this.aggregationOperator);
            return this.getOperation(aggrOperation);
        }
        else {
            let listExpr;
            if (this.logicalOperator !== "EQUAL" && this.attribute.typeHelper.isString()) {
                listExpr = cypher_builder_1.default.collect(cypher_builder_1.default.size(property));
            }
            else {
                listExpr = cypher_builder_1.default.collect(property);
            }
            const comparisonOperation = this.getOperation(comparisonVar);
            return cypher_builder_1.default.any(comparisonVar, listExpr, comparisonOperation);
        }
    }
    getOperation(expr) {
        return this.createBaseOperation({
            operator: this.logicalOperator,
            property: expr,
            param: new cypher_builder_1.default.Param(this.comparisonValue),
        });
    }
    getPropertyRef(queryASTContext) {
        if (this.attachedTo === "node") {
            return queryASTContext.target.property(this.attribute.databaseName);
        }
        else if (this.attachedTo === "relationship" && queryASTContext.relationship) {
            return queryASTContext.relationship.property(this.attribute.databaseName);
        }
        else {
            throw new Error("Transpilation error, relationship on filter not available");
        }
    }
    getAggregateOperation(property, aggregationOperator) {
        switch (aggregationOperator) {
            case "AVERAGE":
                return cypher_builder_1.default.avg(property);
            case "MIN":
            case "SHORTEST":
                return cypher_builder_1.default.min(property);
            case "MAX":
            case "LONGEST":
                return cypher_builder_1.default.max(property);
            case "SUM":
                return cypher_builder_1.default.sum(property);
            default:
                throw new Error(`Invalid operator ${aggregationOperator}`);
        }
    }
    /** Returns the default operation for a given filter */
    createBaseOperation({ operator, property, param, }) {
        switch (operator) {
            case "LT":
                return cypher_builder_1.default.lt(property, param);
            case "LTE":
                return cypher_builder_1.default.lte(property, param);
            case "GT":
                return cypher_builder_1.default.gt(property, param);
            case "GTE":
                return cypher_builder_1.default.gte(property, param);
            case "EQUAL":
                return cypher_builder_1.default.eq(property, param);
            default:
                throw new Error(`Invalid operator ${operator}`);
        }
    }
}
exports.AggregationPropertyFilter = AggregationPropertyFilter;
//# sourceMappingURL=AggregationPropertyFilter.js.map