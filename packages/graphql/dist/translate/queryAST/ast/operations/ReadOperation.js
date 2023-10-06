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
exports.ReadOperation = void 0;
const utils_1 = require("../../../../utils/utils");
const create_node_from_entity_1 = require("../../utils/create-node-from-entity");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const operations_1 = require("./operations");
const CypherAttributeField_1 = require("../fields/attribute-fields/CypherAttributeField");
const CypherPropertySort_1 = require("../sort/CypherPropertySort");
class ReadOperation extends operations_1.Operation {
    constructor({ target, relationship, directed, }) {
        super();
        this.fields = [];
        this.filters = [];
        this.authFilters = [];
        this.sortFields = [];
        this.target = target;
        this.directed = directed ?? true;
        this.relationship = relationship;
    }
    setFields(fields) {
        this.fields = fields;
    }
    addSort(...sort) {
        this.sortFields.push(...sort);
    }
    addPagination(pagination) {
        this.pagination = pagination;
    }
    setFilters(filters) {
        this.filters = filters;
    }
    addAuthFilters(...filter) {
        this.authFilters.push(...filter);
    }
    getAuthFilterSubqueries(context) {
        return this.authFilters.flatMap((f) => f.getSubqueries(context));
    }
    getAuthFilterPredicate(context) {
        return (0, utils_1.filterTruthy)(this.authFilters.map((f) => f.getPredicate(context)));
    }
    transpileNestedRelationship(entity, { context, returnVariable }) {
        //TODO: dupe from transpile
        if (!context.target)
            throw new Error("No parent node found!");
        const relVar = (0, create_node_from_entity_1.createRelationshipFromEntity)(entity);
        const targetNode = (0, create_node_from_entity_1.createNodeFromEntity)(entity.target, context.neo4jGraphQLContext);
        const relDirection = entity.getCypherDirection(this.directed);
        const pattern = new cypher_builder_1.default.Pattern(context.target)
            .withoutLabels()
            .related(relVar)
            .withDirection(relDirection)
            .to(targetNode);
        const nestedContext = context.push({ target: targetNode, relationship: relVar });
        const filterPredicates = this.getPredicates(nestedContext);
        const authFilterSubqueries = this.getAuthFilterSubqueries(nestedContext);
        const authFiltersPredicate = this.getAuthFilterPredicate(nestedContext);
        const { preSelection, selectionClause: matchClause } = this.getSelectionClauses(nestedContext, pattern);
        const wherePredicate = cypher_builder_1.default.and(filterPredicates, ...authFiltersPredicate);
        let withWhere;
        if (wherePredicate) {
            matchClause.where(wherePredicate);
        }
        const cypherFieldSubqueries = this.getCypherFieldsSubqueries(nestedContext);
        const subqueries = cypher_builder_1.default.concat(...this.getFieldsSubqueries(nestedContext), ...cypherFieldSubqueries);
        const sortSubqueries = this.sortFields
            .flatMap((sq) => sq.getSubqueries(nestedContext))
            .map((sq) => new cypher_builder_1.default.Call(sq).innerWith(targetNode));
        const ret = this.getProjectionClause(nestedContext, returnVariable, entity.isList);
        const clause = cypher_builder_1.default.concat(...preSelection, matchClause, ...authFilterSubqueries, withWhere, subqueries, ...sortSubqueries, ret);
        return {
            clauses: [clause],
            projectionExpr: returnVariable,
        };
    }
    getProjectionClause(context, returnVariable, isArray) {
        const projection = this.getProjectionMap(context);
        let aggregationExpr = cypher_builder_1.default.collect(context.target);
        if (!isArray) {
            aggregationExpr = cypher_builder_1.default.head(aggregationExpr);
        }
        const withClause = new cypher_builder_1.default.With([projection, context.target]);
        if (this.sortFields.length > 0 || this.pagination) {
            this.addSortToClause(context, context.target, withClause);
        }
        return withClause.return([aggregationExpr, returnVariable]);
    }
    getPredicates(queryASTContext) {
        return cypher_builder_1.default.and(...[...this.filters].map((f) => f.getPredicate(queryASTContext)));
    }
    getSelectionClauses(context, node) {
        let matchClause = new cypher_builder_1.default.Match(node);
        let extraMatches = this.getChildren().flatMap((f) => {
            return f.getSelection(context);
        });
        if (extraMatches.length > 0) {
            extraMatches = [matchClause, ...extraMatches];
            matchClause = new cypher_builder_1.default.With("*");
        }
        return {
            preSelection: extraMatches,
            selectionClause: matchClause,
        };
    }
    transpile({ context, returnVariable }) {
        if (this.relationship) {
            return this.transpileNestedRelationship(this.relationship, {
                returnVariable: new cypher_builder_1.default.Variable(),
                context,
            });
        }
        const node = (0, create_node_from_entity_1.createNodeFromEntity)(this.target, context.neo4jGraphQLContext, this.nodeAlias);
        const filterSubqueries = this.filters
            .flatMap((f) => f.getSubqueries(context))
            .map((sq) => new cypher_builder_1.default.Call(sq).innerWith(node));
        const filterPredicates = this.getPredicates(context);
        // THis may no longer be relevant?
        const authFilterSubqueries = this.getAuthFilterSubqueries(context);
        const fieldSubqueries = this.getFieldsSubqueries(context);
        const cypherFieldSubqueries = this.getCypherFieldsSubqueries(context);
        const sortSubqueries = this.sortFields
            .flatMap((sq) => sq.getSubqueries(context))
            .map((sq) => new cypher_builder_1.default.Call(sq).innerWith(node));
        const subqueries = cypher_builder_1.default.concat(...fieldSubqueries);
        const authFiltersPredicate = this.getAuthFilterPredicate(context);
        const projection = this.getProjectionMap(context);
        const { preSelection, selectionClause: matchClause } = this.getSelectionClauses(context, node);
        let filterSubqueryWith;
        let filterSubqueriesClause = undefined;
        // This weird condition is just for cypher compatibility
        const shouldAddWithForAuth = authFiltersPredicate.length > 0 && preSelection.length === 0;
        if (filterSubqueries.length > 0 || shouldAddWithForAuth) {
            filterSubqueriesClause = cypher_builder_1.default.concat(...filterSubqueries);
            filterSubqueryWith = new cypher_builder_1.default.With("*");
        }
        const wherePredicate = cypher_builder_1.default.and(filterPredicates, ...authFiltersPredicate);
        if (wherePredicate) {
            if (filterSubqueryWith) {
                filterSubqueryWith.where(wherePredicate); // TODO: should this only be for aggregation filters?
            }
            else {
                matchClause.where(wherePredicate);
            }
        }
        const ret = new cypher_builder_1.default.Return([projection, returnVariable]);
        let sortClause;
        if (this.sortFields.length > 0 || this.pagination) {
            sortClause = new cypher_builder_1.default.With("*");
            this.addSortToClause(context, node, sortClause);
        }
        const sortBlock = cypher_builder_1.default.concat(...sortSubqueries, sortClause);
        let sortAndLimitBlock;
        if (this.hasCypherSort()) {
            // This is a performance optimisation
            sortAndLimitBlock = cypher_builder_1.default.concat(...cypherFieldSubqueries, sortBlock);
        }
        else {
            sortAndLimitBlock = cypher_builder_1.default.concat(sortBlock, ...cypherFieldSubqueries);
        }
        const clause = cypher_builder_1.default.concat(...preSelection, ...authFilterSubqueries, matchClause, filterSubqueriesClause, filterSubqueryWith, sortAndLimitBlock, subqueries, ret);
        return {
            clauses: [clause],
            projectionExpr: returnVariable,
        };
    }
    hasCypherSort() {
        return this.sortFields.some((s) => s instanceof CypherPropertySort_1.CypherPropertySort);
    }
    getChildren() {
        return (0, utils_1.filterTruthy)([
            ...this.filters,
            ...this.authFilters,
            ...this.fields,
            this.pagination,
            ...this.sortFields,
        ]);
    }
    getFieldsSubqueries(context) {
        return (0, utils_1.filterTruthy)(this.fields.flatMap((f) => {
            if (f instanceof CypherAttributeField_1.CypherAttributeField) {
                return;
            }
            return f.getSubqueries(context);
        })).map((sq) => {
            return new cypher_builder_1.default.Call(sq).innerWith(context.target);
        });
    }
    getCypherFieldsSubqueries(context) {
        return (0, utils_1.filterTruthy)(this.getCypherFields().flatMap((f) => {
            return f.getSubqueries(context);
        })).map((sq) => {
            return new cypher_builder_1.default.Call(sq).innerWith(context.target);
        });
    }
    getCypherFields() {
        return this.fields.filter((f) => {
            return f instanceof CypherAttributeField_1.CypherAttributeField;
        });
    }
    getProjectionMap(context) {
        const projectionFields = this.fields.map((f) => f.getProjectionField(context.target));
        const sortProjectionFields = this.sortFields.map((f) => f.getProjectionField(context));
        const uniqueProjectionFields = Array.from(new Set([...projectionFields, ...sortProjectionFields])); // TODO remove duplicates with alias
        const stringFields = [];
        let otherFields = {};
        for (const field of uniqueProjectionFields) {
            if (typeof field === "string")
                stringFields.push(field);
            else {
                otherFields = { ...otherFields, ...field };
            }
        }
        return new cypher_builder_1.default.MapProjection(context.target, stringFields, otherFields);
    }
    addSortToClause(context, node, clause) {
        const isNested = Boolean(context.source); // This is to keep Cypher compatibility
        const orderByFields = this.sortFields.flatMap((f) => f.getSortFields(context, node, !isNested));
        const pagination = this.pagination ? this.pagination.getPagination() : undefined;
        clause.orderBy(...orderByFields);
        if (pagination?.skip) {
            clause.skip(pagination.skip);
        }
        if (pagination?.limit) {
            clause.limit(pagination.limit);
        }
    }
}
exports.ReadOperation = ReadOperation;
//# sourceMappingURL=ReadOperation.js.map