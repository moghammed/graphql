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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("./Filter");
const typescript_memoize_1 = require("typescript-memoize");
const utils_1 = require("../../../../utils/utils");
class RelationshipFilter extends Filter_1.Filter {
    constructor({ relationship, operator, isNot, }) {
        super();
        this.targetNodeFilters = [];
        /** Variable to be used if relationship need to get the count (i.e. 1-1 relationships) */
        this.countVariable = new cypher_builder_1.default.Variable();
        this.relationship = relationship;
        this.isNot = isNot;
        this.operator = operator;
        // Note: This is just to keep naming with previous Cypher, it is safe to remove
        this.countVariable = new cypher_builder_1.default.NamedVariable(`${this.relationship.name}Count`);
    }
    getChildren() {
        return [...this.targetNodeFilters];
    }
    addTargetNodeFilter(...filter) {
        this.targetNodeFilters.push(...filter);
    }
    print() {
        return `${super.print()} [${this.relationship.name}] <${this.isNot ? "NOT " : ""}${this.operator}>`;
    }
    getNestedContext(context) {
        const relatedEntity = this.relationship.target;
        const target = new cypher_builder_1.default.Node({
            labels: relatedEntity.labels,
        });
        const relationship = new cypher_builder_1.default.Relationship({
            type: this.relationship.type,
        });
        const nestedContext = context.push({
            target,
            relationship,
        });
        return nestedContext;
    }
    getNestedSelectionSubqueries(context) {
        const returnVars = [];
        const nestedSelection = (0, utils_1.filterTruthy)(this.targetNodeFilters.map((f) => {
            const selection = f.getSelection(context);
            if (selection.length === 0)
                return undefined;
            const pattern = new cypher_builder_1.default.Pattern(context.source)
                .withoutLabels()
                .related(context.relationship)
                .withoutVariable()
                .withDirection(this.relationship.getCypherDirection())
                .to(context.target);
            const relationshipMatch = new cypher_builder_1.default.Match(pattern);
            const countVar = new cypher_builder_1.default.Variable();
            returnVars.push(countVar);
            const predicate = f.getPredicate(context);
            const withClause = new cypher_builder_1.default.With("*");
            if (predicate)
                withClause.where(predicate);
            let returnCondition;
            if (!this.relationship.isList) {
                returnCondition = cypher_builder_1.default.eq(cypher_builder_1.default.count(context.target), new cypher_builder_1.default.Literal(1));
            }
            else {
                returnCondition = cypher_builder_1.default.gt(cypher_builder_1.default.count(context.target), new cypher_builder_1.default.Literal(0));
            }
            withClause.return([returnCondition, countVar]);
            return cypher_builder_1.default.concat(relationshipMatch, ...selection, withClause);
        }));
        const predicates = returnVars.map((v) => cypher_builder_1.default.eq(v, cypher_builder_1.default.true));
        this.subqueryPredicate = cypher_builder_1.default.and(...predicates);
        return nestedSelection;
    }
    getSubqueries(context) {
        // NOTE: not using getNestedContext because this should not be memoized in ALL operations
        const relatedEntity = this.relationship.target;
        const target = new cypher_builder_1.default.Node({
            labels: relatedEntity.labels,
        });
        const relationship = new cypher_builder_1.default.Relationship({
            type: this.relationship.type,
        });
        const nestedContext = context.push({
            target,
            relationship,
        });
        const subqueries = [];
        const nestedSubqueries = this.targetNodeFilters.flatMap((f) => f.getSubqueries(nestedContext));
        const nestedSelection = this.getNestedSelectionSubqueries(nestedContext);
        if (nestedSubqueries.length > 0) {
            subqueries.push(...this.getNestedSubqueries(nestedContext));
        }
        if (nestedSelection.length > 0) {
            subqueries.push(...nestedSelection);
        }
        return subqueries;
    }
    getNestedSubqueries(context) {
        const pattern = new cypher_builder_1.default.Pattern(context.source)
            .withoutLabels()
            .related(context.relationship)
            .withoutVariable()
            .withDirection(this.relationship.getCypherDirection())
            .to(context.target);
        switch (this.operator) {
            case "NONE":
            case "SOME":
            case "SINGLE": {
                const match = new cypher_builder_1.default.Match(pattern);
                const returnVar = new cypher_builder_1.default.Variable();
                const nestedSubqueries = this.targetNodeFilters.flatMap((f) => {
                    return f.getSubqueries(context).map((sq) => {
                        return new cypher_builder_1.default.Call(sq).innerWith(context.target);
                    });
                });
                const subqueriesFilters = this.targetNodeFilters.map((f) => f.getPredicate(context));
                const subqueriesPredicate = cypher_builder_1.default.and(...subqueriesFilters);
                // NOTE: NONE is SOME + isNot
                // TODO: move to wrapInNullIfNeeded in getPredicate
                const comparator = this.isNot ? cypher_builder_1.default.false : cypher_builder_1.default.true;
                this.subqueryPredicate = cypher_builder_1.default.eq(returnVar, comparator);
                const withAfterSubqueries = new cypher_builder_1.default.With("*");
                if (subqueriesPredicate) {
                    withAfterSubqueries.where(subqueriesPredicate);
                }
                const returnPredicate = this.getNestedSubqueryFilter(context.target);
                withAfterSubqueries.return([returnPredicate, returnVar]);
                return [cypher_builder_1.default.concat(match, ...nestedSubqueries, withAfterSubqueries)];
            }
            case "ALL": {
                const { clause: nestedSubqueries, returnVariables: truthyReturn } = this.getSubqueryForAllFilter(pattern, context, false);
                const { clause: nestedSubqueries2, returnVariables: falsyReturn } = this.getSubqueryForAllFilter(pattern, context, true);
                this.subqueryPredicate = cypher_builder_1.default.and(...falsyReturn.map((v) => cypher_builder_1.default.eq(v, cypher_builder_1.default.false)), ...truthyReturn.map((v) => cypher_builder_1.default.eq(v, cypher_builder_1.default.true)));
                return [nestedSubqueries, nestedSubqueries2];
            }
        }
    }
    getSubqueryForAllFilter(pattern, context, notPredicate) {
        const returnVariables = [];
        const match = new cypher_builder_1.default.Match(pattern);
        const subqueries = this.targetNodeFilters.map((f) => {
            const returnVar = new cypher_builder_1.default.Variable();
            returnVariables.push(returnVar);
            const nestedSubqueries = f.getSubqueries(context).map((sq) => {
                return new cypher_builder_1.default.Call(sq).innerWith(context.target);
            });
            let predicate = f.getPredicate(context);
            if (predicate && notPredicate) {
                predicate = cypher_builder_1.default.not(predicate);
            }
            const withClause = new cypher_builder_1.default.With("*");
            if (predicate) {
                withClause.where(predicate);
            }
            withClause.return([cypher_builder_1.default.gt(cypher_builder_1.default.count(context.target), new cypher_builder_1.default.Literal(0)), returnVar]); // THis variable needs to be used in predicate
            return cypher_builder_1.default.concat(...nestedSubqueries, withClause);
        });
        return { clause: cypher_builder_1.default.concat(match, ...subqueries), returnVariables };
    }
    getNestedSubqueryFilter(target) {
        switch (this.operator) {
            case "NONE":
            case "SOME":
                if (this.relationship.isList) {
                    return cypher_builder_1.default.gt(cypher_builder_1.default.count(target), new cypher_builder_1.default.Literal(0));
                }
                else {
                    return cypher_builder_1.default.eq(cypher_builder_1.default.count(target), new cypher_builder_1.default.Literal(1));
                }
            case "SINGLE":
                return cypher_builder_1.default.eq(cypher_builder_1.default.count(target), new cypher_builder_1.default.Literal(1));
            case "ALL":
                throw new Error("Not supported");
        }
    }
    shouldCreateOptionalMatch() {
        return !this.relationship.isList && !this.relationship.isNullable;
    }
    getSelection(queryASTContext) {
        if (this.shouldCreateOptionalMatch() && !this.subqueryPredicate) {
            const nestedContext = this.getNestedContext(queryASTContext);
            const pattern = new cypher_builder_1.default.Pattern(nestedContext.source)
                .withoutLabels()
                .related(nestedContext.relationship)
                .withDirection(this.relationship.getCypherDirection())
                .withoutVariable()
                .to(nestedContext.target);
            return [
                new cypher_builder_1.default.OptionalMatch(pattern).with("*", [cypher_builder_1.default.count(nestedContext.target), this.countVariable]),
            ];
        }
        return [];
    }
    getPredicate(queryASTContext) {
        if (this.subqueryPredicate)
            return this.subqueryPredicate;
        const nestedContext = this.getNestedContext(queryASTContext);
        if (this.shouldCreateOptionalMatch()) {
            const predicates = this.targetNodeFilters.map((c) => c.getPredicate(nestedContext));
            const innerPredicate = cypher_builder_1.default.and(...predicates);
            return cypher_builder_1.default.and(cypher_builder_1.default.neq(this.countVariable, new cypher_builder_1.default.Literal(0)), innerPredicate);
        }
        const pattern = new cypher_builder_1.default.Pattern(nestedContext.source)
            .withoutLabels()
            .related(nestedContext.relationship)
            .withDirection(this.relationship.getCypherDirection())
            .withoutVariable()
            .to(nestedContext.target);
        const predicate = this.createRelationshipOperation(pattern, nestedContext);
        if (!predicate)
            return undefined;
        return this.wrapInNotIfNeeded(predicate);
    }
    getSingleRelationshipOperation({ pattern, queryASTContext, innerPredicate, }) {
        const patternComprehension = new cypher_builder_1.default.PatternComprehension(pattern, new cypher_builder_1.default.Literal(1)).where(innerPredicate);
        return cypher_builder_1.default.single(queryASTContext.target, patternComprehension, new cypher_builder_1.default.Literal(true));
    }
    createRelationshipOperation(pattern, queryASTContext) {
        const predicates = this.targetNodeFilters.map((c) => c.getPredicate(queryASTContext));
        const innerPredicate = cypher_builder_1.default.and(...predicates);
        switch (this.operator) {
            case "ALL": {
                if (!innerPredicate)
                    return undefined;
                const match = new cypher_builder_1.default.Match(pattern).where(innerPredicate);
                const negativeMatch = new cypher_builder_1.default.Match(pattern).where(cypher_builder_1.default.not(innerPredicate));
                // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
                return cypher_builder_1.default.and(new cypher_builder_1.default.Exists(match), cypher_builder_1.default.not(new cypher_builder_1.default.Exists(negativeMatch)));
            }
            case "SINGLE": {
                if (!innerPredicate)
                    return undefined;
                return this.getSingleRelationshipOperation({
                    pattern,
                    queryASTContext,
                    innerPredicate,
                });
            }
            case "NONE":
            case "SOME": {
                if (!this.relationship.isList && this.relationship.isNullable) {
                    if (!innerPredicate)
                        return undefined;
                    return this.getSingleRelationshipOperation({
                        pattern,
                        queryASTContext,
                        innerPredicate,
                    });
                }
                const match = new cypher_builder_1.default.Match(pattern);
                if (innerPredicate) {
                    return new cypher_builder_1.default.Exists(match.where(innerPredicate));
                }
                return new cypher_builder_1.default.Exists(match);
            }
        }
    }
    wrapInNotIfNeeded(predicate) {
        if (this.isNot)
            return cypher_builder_1.default.not(predicate);
        else
            return predicate;
    }
}
exports.RelationshipFilter = RelationshipFilter;
__decorate([
    (0, typescript_memoize_1.Memoize)()
], RelationshipFilter.prototype, "getNestedContext", null);
__decorate([
    (0, typescript_memoize_1.Memoize)()
], RelationshipFilter.prototype, "getNestedSelectionSubqueries", null);
//# sourceMappingURL=RelationshipFilter.js.map