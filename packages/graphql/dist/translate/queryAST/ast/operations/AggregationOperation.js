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
exports.AggregationOperation = void 0;
const utils_1 = require("../../../../utils/utils");
const create_node_from_entity_1 = require("../../utils/create-node-from-entity");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const operations_1 = require("./operations");
// TODO: somewhat dupe of readOperation
class AggregationOperation extends operations_1.Operation {
    constructor(entity, directed = true) {
        super();
        this.fields = []; // Aggregation fields
        this.nodeFields = []; // Aggregation node fields
        this.edgeFields = []; // Aggregation node fields
        this.authFilters = [];
        this.aggregationProjectionMap = new cypher_builder_1.default.Map();
        this.filters = [];
        this.sortFields = [];
        this.entity = entity;
        this.directed = directed;
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
    getChildren() {
        return (0, utils_1.filterTruthy)([
            ...this.fields,
            ...this.nodeFields,
            ...this.edgeFields,
            ...this.filters,
            ...this.sortFields,
            ...this.authFilters,
            this.pagination,
        ]);
    }
    createSubquery(entity, field, pattern, target, returnVariable, context) {
        const matchClause = new cypher_builder_1.default.Match(pattern);
        const filterPredicates = this.getPredicates(context);
        if (filterPredicates) {
            matchClause.where(filterPredicates);
        }
        const ret = this.getFieldProjectionClause(target, returnVariable, field);
        let sortClause;
        if (this.sortFields.length > 0 || this.pagination) {
            sortClause = new cypher_builder_1.default.With("*");
            this.addSortToClause(context, target, sortClause);
        }
        return cypher_builder_1.default.concat(matchClause, sortClause, ret);
    }
    transpileNestedRelationship(
    // Create new Clause per field
    entity, { context }) {
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
        const nestedContext = context.push({ relationship: relVar, target: targetNode });
        const fieldSubqueries = this.fields.map((f) => {
            const returnVariable = new cypher_builder_1.default.Variable();
            this.aggregationProjectionMap.set(f.getProjectionField(returnVariable));
            return this.createSubquery(entity, f, pattern, targetNode, returnVariable, nestedContext);
        });
        const nodeMap = new cypher_builder_1.default.Map();
        const edgeMap = new cypher_builder_1.default.Map();
        const nodeFieldSubqueries = this.nodeFields.map((f) => {
            const returnVariable = new cypher_builder_1.default.Variable();
            nodeMap.set(f.getProjectionField(returnVariable));
            return this.createSubquery(entity, f, pattern, targetNode, returnVariable, nestedContext);
        });
        const edgeFieldSubqueries = this.edgeFields.map((f) => {
            const returnVariable = new cypher_builder_1.default.Variable();
            edgeMap.set(f.getProjectionField(returnVariable));
            return this.createSubquery(entity, f, pattern, relVar, returnVariable, nestedContext);
        });
        if (nodeMap.size > 0) {
            this.aggregationProjectionMap.set("node", nodeMap);
        }
        if (edgeMap.size > 0) {
            this.aggregationProjectionMap.set("edge", edgeMap);
        }
        return [...fieldSubqueries, ...nodeFieldSubqueries, ...edgeFieldSubqueries];
    }
    getFieldProjectionClause(target, returnVariable, field) {
        return field.getAggregationProjection(target, returnVariable);
    }
    getPredicates(queryASTContext) {
        const authPredicates = this.getAuthFilterPredicate(queryASTContext);
        return cypher_builder_1.default.and(...this.filters.map((f) => f.getPredicate(queryASTContext)), ...authPredicates);
    }
    getAuthFilterPredicate(context) {
        return (0, utils_1.filterTruthy)(this.authFilters.map((f) => f.getPredicate(context)));
    }
    transpile({ context }) {
        const clauses = this.transpileNestedRelationship(this.entity, {
            context,
            returnVariable: new cypher_builder_1.default.Variable(),
        });
        return {
            clauses,
            projectionExpr: this.aggregationProjectionMap,
        };
    }
    addSortToClause(context, node, clause) {
        const orderByFields = this.sortFields.flatMap((f) => f.getSortFields(context, node));
        const pagination = this.pagination ? this.pagination.getPagination() : undefined;
        clause.orderBy(...orderByFields);
        if (pagination?.skip) {
            clause.skip(pagination.skip);
        }
        if (pagination?.limit) {
            clause.limit(pagination.limit);
        }
    }
    setNodeFields(fields) {
        this.nodeFields = fields;
    }
    setEdgeFields(fields) {
        this.edgeFields = fields;
    }
}
exports.AggregationOperation = AggregationOperation;
//# sourceMappingURL=AggregationOperation.js.map