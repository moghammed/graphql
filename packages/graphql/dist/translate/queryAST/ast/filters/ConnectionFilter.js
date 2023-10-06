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
exports.ConnectionFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("./Filter");
const is_concrete_entity_1 = require("../../utils/is-concrete-entity");
const is_interface_entity_1 = require("../../utils/is-interface-entity");
class ConnectionFilter extends Filter_1.Filter {
    constructor({ relationship, target, operator, isNot, }) {
        super();
        this.innerFilters = [];
        this.relationship = relationship;
        this.isNot = isNot;
        this.operator = operator || "SOME";
        this.target = target;
    }
    addFilters(filters) {
        this.innerFilters.push(...filters);
    }
    getChildren() {
        return [...this.innerFilters];
    }
    print() {
        return `${super.print()} [${this.relationship.name}] <${this.operator}>`;
    }
    getTargetNode() {
        // if the target is an interface entity, we need to use the label predicate optimization
        if ((0, is_interface_entity_1.isInterfaceEntity)(this.target)) {
            return new cypher_builder_1.default.Node();
        }
        return new cypher_builder_1.default.Node({
            labels: this.target.labels,
        });
    }
    getSubqueries(context) {
        const targetNode = this.getTargetNode();
        const relationship = new cypher_builder_1.default.Relationship({
            type: this.relationship.type,
        });
        const pattern = new cypher_builder_1.default.Pattern(context.target)
            .withoutLabels()
            .related(relationship)
            .withDirection(this.relationship.getCypherDirection())
            .to(targetNode);
        const nestedContext = context.push({
            relationship,
            target: targetNode,
        });
        switch (this.operator) {
            case "ALL":
                return this.getSubqueriesForOperationAll(pattern, nestedContext);
            default:
                return this.getSubqueriesForDefaultOperations(pattern, nestedContext);
        }
    }
    getPredicate(queryASTContext) {
        if (this.subqueryPredicate)
            return this.subqueryPredicate;
        else {
            const target = this.getTargetNode();
            const relationship = new cypher_builder_1.default.Relationship({
                type: this.relationship.type,
            });
            const pattern = new cypher_builder_1.default.Pattern(queryASTContext.target)
                .withoutLabels()
                .related(relationship)
                .withDirection(this.relationship.getCypherDirection())
                .to(target);
            const nestedContext = queryASTContext.push({ target, relationship });
            const predicate = this.createRelationshipOperation(pattern, nestedContext);
            if (!predicate)
                return undefined;
            return this.wrapInNotIfNeeded(predicate);
        }
    }
    /**
     * Create a label predicate that filters concrete entities for interface target,
     * so that the same pattern matching can be used for all the concrete entities implemented by the interface entity.
     * Example:
     * MATCH (this:Actor)
     * WHERE EXISTS {
     *    MATCH (this)<-[this0:ACTED_IN]-(this1)
     *    WHERE (this1.title = $param0 AND (this1:Movie OR this1:Show)
     * }
     * RETURN this { .name } AS this
     **/
    getLabelPredicate(context) {
        if ((0, is_concrete_entity_1.isConcreteEntity)(this.target))
            return undefined;
        const labelPredicate = this.target.concreteEntities.map((e) => {
            return context.target.hasLabels(...e.labels);
        });
        return cypher_builder_1.default.or(...labelPredicate);
    }
    createRelationshipOperation(pattern, nestedContext) {
        const connectionFilter = this.innerFilters.map((c) => c.getPredicate(nestedContext));
        const labelPredicate = this.getLabelPredicate(nestedContext);
        const innerPredicate = cypher_builder_1.default.and(...connectionFilter, labelPredicate);
        if (!innerPredicate)
            return undefined;
        switch (this.operator) {
            case "ALL": {
                const match = new cypher_builder_1.default.Match(pattern).where(innerPredicate);
                const negativeMatch = new cypher_builder_1.default.Match(pattern).where(cypher_builder_1.default.not(innerPredicate));
                // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
                return cypher_builder_1.default.and(new cypher_builder_1.default.Exists(match), cypher_builder_1.default.not(new cypher_builder_1.default.Exists(negativeMatch)));
            }
            case "SINGLE": {
                return this.createSingleRelationshipOperation(pattern, nestedContext, innerPredicate);
            }
            default: {
                if (!this.relationship.isList) {
                    return this.createSingleRelationshipOperation(pattern, nestedContext, innerPredicate);
                }
                const match = new cypher_builder_1.default.Match(pattern).where(innerPredicate);
                return new cypher_builder_1.default.Exists(match);
            }
        }
    }
    createSingleRelationshipOperation(pattern, context, innerPredicate) {
        const patternComprehension = new cypher_builder_1.default.PatternComprehension(pattern, new cypher_builder_1.default.Literal(1)).where(innerPredicate);
        return cypher_builder_1.default.single(context.target, patternComprehension, new cypher_builder_1.default.Literal(true));
    }
    getSubqueriesForDefaultOperations(pattern, queryASTContext) {
        const match = new cypher_builder_1.default.Match(pattern);
        const returnVar = new cypher_builder_1.default.Variable();
        const innerFiltersPredicates = [];
        const subqueries = this.innerFilters.flatMap((f) => {
            const nestedSubqueries = f
                .getSubqueries(queryASTContext)
                .map((sq) => new cypher_builder_1.default.Call(sq).innerWith(queryASTContext.target));
            const predicate = f.getPredicate(queryASTContext);
            if (predicate) {
                innerFiltersPredicates.push(predicate);
                return nestedSubqueries;
            }
            return nestedSubqueries;
        });
        if (subqueries.length === 0)
            return []; // Hack logic to change predicates logic
        const comparisonValue = this.isNot ? cypher_builder_1.default.false : cypher_builder_1.default.true;
        this.subqueryPredicate = cypher_builder_1.default.eq(returnVar, comparisonValue);
        const countComparisonPredicate = this.operator === "SINGLE"
            ? cypher_builder_1.default.eq(cypher_builder_1.default.count(queryASTContext.target), new cypher_builder_1.default.Literal(1))
            : cypher_builder_1.default.gt(cypher_builder_1.default.count(queryASTContext.target), new cypher_builder_1.default.Literal(0));
        const withPredicateReturn = new cypher_builder_1.default.With("*")
            .where(cypher_builder_1.default.and(...innerFiltersPredicates))
            .return([countComparisonPredicate, returnVar]);
        return [cypher_builder_1.default.concat(match, ...subqueries, withPredicateReturn)];
    }
    // This method has a big deal of complexity due to a couple of factors:
    // 1. "All" operations require 2 CALL subqueries
    // 2. Each subquery has its own return variable, that needs to be carried over to the predicate
    getSubqueriesForOperationAll(pattern, queryASTContext) {
        const match = new cypher_builder_1.default.Match(pattern);
        const match2 = new cypher_builder_1.default.Match(pattern);
        const truthyFilters = [];
        const falsyFilters = [];
        const subqueries = this.innerFilters.flatMap((f) => {
            const nestedSubqueries = f.getSubqueries(queryASTContext).map((sq) => {
                const predicate = f.getPredicate(queryASTContext);
                if (predicate) {
                    const returnVar = new cypher_builder_1.default.Variable();
                    truthyFilters.push(returnVar);
                    return new cypher_builder_1.default.Call(sq)
                        .innerWith(queryASTContext.target)
                        .with("*")
                        .where(predicate)
                        .return([cypher_builder_1.default.gt(cypher_builder_1.default.count(queryASTContext.target), new cypher_builder_1.default.Literal(0)), returnVar]);
                }
            });
            return nestedSubqueries;
        });
        if (subqueries.length === 0)
            return [];
        const subqueries2 = this.innerFilters.flatMap((f) => {
            const nestedSubqueries = f.getSubqueries(queryASTContext).map((sq) => {
                const predicate = f.getPredicate(queryASTContext);
                if (predicate) {
                    const returnVar = new cypher_builder_1.default.Variable();
                    falsyFilters.push(returnVar);
                    return new cypher_builder_1.default.Call(sq)
                        .innerWith(queryASTContext.target)
                        .with("*")
                        .where(cypher_builder_1.default.not(predicate))
                        .return([cypher_builder_1.default.gt(cypher_builder_1.default.count(queryASTContext.target), new cypher_builder_1.default.Literal(0)), returnVar]);
                }
            });
            return nestedSubqueries;
        });
        const falsyPredicates = falsyFilters.map((v) => cypher_builder_1.default.eq(v, cypher_builder_1.default.false));
        const truthyPredicates = truthyFilters.map((v) => cypher_builder_1.default.eq(v, cypher_builder_1.default.true));
        this.subqueryPredicate = cypher_builder_1.default.and(...falsyPredicates, ...truthyPredicates);
        return [cypher_builder_1.default.concat(match, ...subqueries), cypher_builder_1.default.concat(match2, ...subqueries2)];
    }
    wrapInNotIfNeeded(predicate) {
        if (this.isNot)
            return cypher_builder_1.default.not(predicate);
        else
            return predicate;
    }
}
exports.ConnectionFilter = ConnectionFilter;
//# sourceMappingURL=ConnectionFilter.js.map