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
exports.CompositeConnectionPartial = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_node_from_entity_1 = require("../../../utils/create-node-from-entity");
const ConnectionReadOperation_1 = require("../ConnectionReadOperation");
class CompositeConnectionPartial extends ConnectionReadOperation_1.ConnectionReadOperation {
    transpile({ returnVariable, context }) {
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
        // This bit is different than normal connection ops
        const targetNodeName = this.target.name;
        nodeProjectionMap.set({
            __resolveType: new cypher_builder_1.default.Literal(targetNodeName),
            __id: cypher_builder_1.default.id(node),
        });
        const nodeProjectionFields = this.nodeFields.map((f) => f.getProjectionField(node));
        const nodeSortProjectionFields = this.sortFields.flatMap((f) => f.node.map((ef) => ef.getProjectionField(nestedContext)));
        const uniqueNodeProjectionFields = Array.from(new Set([...nodeProjectionFields, ...nodeSortProjectionFields]));
        uniqueNodeProjectionFields.forEach((p) => {
            if (typeof p === "string") {
                nodeProjectionMap.set(p, node.property(p));
            }
            else {
                nodeProjectionMap.set(p);
            }
        });
        const edgeVar = new cypher_builder_1.default.NamedVariable("edge");
        const edgeProjectionMap = new cypher_builder_1.default.Map();
        const edgeProjectionFields = this.edgeFields.map((f) => f.getProjectionField(relationship));
        const edgeSortProjectionFields = this.sortFields.flatMap((f) => f.edge.map((ef) => ef.getProjectionField(nestedContext)));
        const uniqueEdgeProjectionFields = Array.from(new Set([...edgeProjectionFields, ...edgeSortProjectionFields]));
        uniqueEdgeProjectionFields.forEach((p) => {
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
        const projectionClauses = new cypher_builder_1.default.With([edgeProjectionMap, edgeVar]).return(returnVariable);
        const subClause = cypher_builder_1.default.concat(...preSelection, clause, ...authFilterSubqueries, withWhere, ...nodeProjectionSubqueries, projectionClauses);
        return {
            clauses: [subClause],
            projectionExpr: returnVariable,
        };
    }
    // Sort is handled by CompositeConnectionReadOperation
    addSort(sortElement) {
        this.sortFields.push(sortElement);
    }
    // Pagination is handled by CompositeConnectionReadOperation
    addPagination(_pagination) {
        return undefined;
    }
}
exports.CompositeConnectionPartial = CompositeConnectionPartial;
//# sourceMappingURL=CompositeConnectionPartial.js.map