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
exports.AggregationFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("../Filter");
class AggregationFilter extends Filter_1.Filter {
    constructor(relationship) {
        super();
        this.filters = [];
        this.relationship = relationship;
    }
    addFilters(...filter) {
        this.filters.push(...filter);
    }
    getChildren() {
        return [...this.filters];
    }
    getSubqueries(context) {
        this.subqueryReturnVariable = new cypher_builder_1.default.Variable();
        const relatedEntity = this.relationship.target;
        const relatedNode = new cypher_builder_1.default.Node({
            labels: relatedEntity.labels,
        });
        const relationshipTarget = new cypher_builder_1.default.Relationship({
            type: this.relationship.type,
        });
        const pattern = new cypher_builder_1.default.Pattern(context.target)
            .withoutLabels()
            .related(relationshipTarget)
            .withDirection(this.relationship.getCypherDirection())
            .to(relatedNode);
        const nestedContext = context.push({
            target: relatedNode,
            relationship: relationshipTarget,
        });
        const predicates = cypher_builder_1.default.and(...this.filters.map((f) => f.getPredicate(nestedContext)));
        const returnColumns = [];
        if (predicates) {
            returnColumns.push([predicates, this.subqueryReturnVariable]);
        }
        if (returnColumns.length === 0)
            return []; // Maybe throw?
        const subquery = new cypher_builder_1.default.Match(pattern).return(...returnColumns);
        return [subquery];
    }
    getPredicate(_queryASTContext) {
        if (!this.subqueryReturnVariable)
            return undefined;
        return cypher_builder_1.default.eq(this.subqueryReturnVariable, cypher_builder_1.default.true);
    }
}
exports.AggregationFilter = AggregationFilter;
//# sourceMappingURL=AggregationFilter.js.map