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
exports.ConnectionReadOperation = void 0;
const create_node_from_entity_1 = require("../../utils/create-node-from-entity");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const operations_1 = require("./operations");
const utils_1 = require("../../../../utils/utils");
class ConnectionReadOperation extends operations_1.Operation {
    constructor({ relationship, directed, target, }) {
        super();
        this.nodeFields = [];
        this.edgeFields = []; // TODO: merge with attachedTo?
        this.filters = [];
        this.sortFields = [];
        this.authFilters = [];
        this.relationship = relationship;
        this.directed = directed;
        this.target = target;
    }
    setNodeFields(fields) {
        this.nodeFields = fields;
    }
    setFilters(filters) {
        this.filters = filters;
    }
    setEdgeFields(fields) {
        this.edgeFields = fields;
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
    addSort(sortElement) {
        this.sortFields.push(sortElement);
    }
    addPagination(pagination) {
        this.pagination = pagination;
    }
    getChildren() {
        const sortFields = this.sortFields.flatMap((s) => {
            return [...s.edge, ...s.node];
        });
        return (0, utils_1.filterTruthy)([
            ...this.nodeFields,
            ...this.edgeFields,
            ...this.filters,
            ...this.authFilters,
            this.pagination,
            ...sortFields,
        ]);
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
        if (!context.target)
            throw new Error();
        const node = (0, create_node_from_entity_1.createNodeFromEntity)(this.target, context.neo4jGraphQLContext);
        const relationship = new cypher_builder_1.default.Relationship({ type: this.relationship.type });
        const relDirection = this.relationship.getCypherDirection(this.directed);
        const pattern = new cypher_builder_1.default.Pattern(context.target)
            .withoutLabels()
            .related(relationship)
            .withDirection(relDirection)
            .to(node);
        const nestedContext = context.push({ target: node, relationship });
        const { preSelection, selectionClause: clause } = this.getSelectionClauses(nestedContext, pattern);
        const predicates = this.filters.map((f) => f.getPredicate(nestedContext));
        const authPredicate = this.getAuthFilterPredicate(nestedContext);
        const authFilterSubqueries = this.getAuthFilterSubqueries(nestedContext);
        const filters = cypher_builder_1.default.and(...predicates, ...authPredicate);
        const nodeProjectionSubqueries = this.nodeFields
            .flatMap((f) => f.getSubqueries(nestedContext))
            .map((sq) => new cypher_builder_1.default.Call(sq).innerWith(node));
        const nodeProjectionMap = new cypher_builder_1.default.Map();
        this.nodeFields
            .map((f) => f.getProjectionField(node))
            .forEach((p) => {
            if (typeof p === "string") {
                nodeProjectionMap.set(p, node.property(p));
            }
            else {
                nodeProjectionMap.set(p);
            }
        });
        if (nodeProjectionMap.size === 0) {
            const targetNodeName = this.target.name;
            nodeProjectionMap.set({
                __resolveType: new cypher_builder_1.default.Literal(targetNodeName),
                __id: cypher_builder_1.default.id(node),
            });
        }
        const edgeVar = new cypher_builder_1.default.NamedVariable("edge");
        const edgesVar = new cypher_builder_1.default.NamedVariable("edges");
        const totalCount = new cypher_builder_1.default.NamedVariable("totalCount");
        const edgeProjectionMap = new cypher_builder_1.default.Map();
        this.edgeFields
            .map((f) => f.getProjectionField(relationship))
            .forEach((p) => {
            if (typeof p === "string") {
                edgeProjectionMap.set(p, relationship.property(p));
            }
            else {
                edgeProjectionMap.set(p);
            }
        });
        edgeProjectionMap.set("node", nodeProjectionMap);
        let withWhere;
        if (filters) {
            if (authFilterSubqueries.length > 0) {
                // This is to avoid unnecessary With *
                withWhere = new cypher_builder_1.default.With("*").where(filters);
            }
            else {
                clause.where(filters);
            }
        }
        let sortSubquery;
        if (this.pagination || this.sortFields.length > 0) {
            const paginationField = this.pagination && this.pagination.getPagination();
            sortSubquery = this.getPaginationSubquery(nestedContext, edgesVar, paginationField);
            sortSubquery.addColumns(totalCount);
        }
        let extraWithOrder;
        if (this.sortFields.length > 0) {
            const sortFields = this.getSortFields(nestedContext, node, relationship);
            extraWithOrder = new cypher_builder_1.default.With(relationship, node).orderBy(...sortFields);
        }
        const projectionClauses = new cypher_builder_1.default.With([edgeProjectionMap, edgeVar])
            .with([cypher_builder_1.default.collect(edgeVar), edgesVar])
            .with(edgesVar, [cypher_builder_1.default.size(edgesVar), totalCount]);
        const returnClause = new cypher_builder_1.default.Return([
            new cypher_builder_1.default.Map({
                edges: edgesVar,
                totalCount: totalCount,
            }),
            returnVariable,
        ]);
        const subClause = cypher_builder_1.default.concat(...preSelection, clause, ...authFilterSubqueries, withWhere, extraWithOrder, ...nodeProjectionSubqueries, projectionClauses, sortSubquery, returnClause);
        return {
            clauses: [subClause],
            projectionExpr: returnVariable,
        };
    }
    getPaginationSubquery(context, edgesVar, paginationField) {
        const edgeVar = new cypher_builder_1.default.NamedVariable("edge");
        const subquery = new cypher_builder_1.default.Unwind([edgesVar, edgeVar]).with(edgeVar);
        if (this.sortFields.length > 0) {
            const sortFields = this.getSortFields(context, edgeVar.property("node"), edgeVar);
            subquery.orderBy(...sortFields);
        }
        if (paginationField && paginationField.skip) {
            subquery.skip(paginationField.skip);
        }
        if (paginationField && paginationField.limit) {
            subquery.limit(paginationField.limit);
        }
        const returnVar = new cypher_builder_1.default.Variable();
        subquery.return([cypher_builder_1.default.collect(edgeVar), returnVar]);
        return new cypher_builder_1.default.Call(subquery).innerWith(edgesVar).with([returnVar, edgesVar]);
    }
    getSortFields(context, nodeVar, edgeVar) {
        return this.sortFields.flatMap(({ node, edge }) => {
            const nodeFields = node.flatMap((s) => s.getSortFields(context, nodeVar, false));
            const edgeFields = edge.flatMap((s) => s.getSortFields(context, edgeVar, false));
            return [...nodeFields, ...edgeFields];
        });
    }
}
exports.ConnectionReadOperation = ConnectionReadOperation;
//# sourceMappingURL=ConnectionReadOperation.js.map