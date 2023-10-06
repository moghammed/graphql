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
exports.CompositeConnectionReadOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const operations_1 = require("../operations");
const QueryASTContext_1 = require("../../QueryASTContext");
const utils_1 = require("../../../../../utils/utils");
class CompositeConnectionReadOperation extends operations_1.Operation {
    constructor(children) {
        super();
        this.sortFields = [];
        this.children = children;
    }
    transpile({ context, returnVariable }) {
        const edgeVar = new cypher_builder_1.default.NamedVariable("edge");
        const edgesVar = new cypher_builder_1.default.NamedVariable("edges");
        const totalCount = new cypher_builder_1.default.NamedVariable("totalCount");
        const nestedSubqueries = this.children.flatMap((c) => {
            const result = c.transpile({
                context,
                returnVariable: edgeVar,
            });
            const parentNode = context.target;
            return result.clauses.map((sq) => cypher_builder_1.default.concat(new cypher_builder_1.default.With(parentNode), sq));
        });
        const union = new cypher_builder_1.default.Union(...nestedSubqueries);
        const nestedSubquery = new cypher_builder_1.default.Call(union);
        let extraWithOrder;
        if (this.pagination || this.sortFields.length > 0) {
            const paginationField = this.pagination && this.pagination.getPagination();
            const nestedContext = new QueryASTContext_1.QueryASTContext({
                // NOOP context
                target: new cypher_builder_1.default.Node(),
                env: context.env,
                neo4jGraphQLContext: context.neo4jGraphQLContext,
            });
            const sortFields = this.getSortFields(nestedContext, edgeVar.property("node"), edgeVar);
            extraWithOrder = new cypher_builder_1.default.Unwind([edgesVar, edgeVar]).with(edgeVar, totalCount).orderBy(...sortFields);
            if (paginationField && paginationField.skip) {
                extraWithOrder.skip(paginationField.skip);
            }
            // Missing skip
            if (paginationField && paginationField.limit) {
                extraWithOrder.limit(paginationField.limit);
            }
            extraWithOrder.with([cypher_builder_1.default.collect(edgeVar), edgesVar], totalCount);
        }
        nestedSubquery.with([cypher_builder_1.default.collect(edgeVar), edgesVar]).with(edgesVar, [cypher_builder_1.default.size(edgesVar), totalCount]);
        const returnClause = new cypher_builder_1.default.Return([
            new cypher_builder_1.default.Map({
                edges: edgesVar,
                totalCount: totalCount,
            }),
            returnVariable,
        ]);
        return {
            clauses: [cypher_builder_1.default.concat(nestedSubquery, extraWithOrder, returnClause)],
            projectionExpr: returnVariable,
        };
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
        return (0, utils_1.filterTruthy)([...this.children, ...sortFields, this.pagination]);
    }
    getSortFields(context, nodeVar, edgeVar) {
        return this.sortFields.flatMap(({ node, edge }) => {
            const nodeFields = node.flatMap((s) => s.getSortFields(context, nodeVar, false));
            const edgeFields = edge.flatMap((s) => s.getSortFields(context, edgeVar, false));
            return [...nodeFields, ...edgeFields];
        });
    }
}
exports.CompositeConnectionReadOperation = CompositeConnectionReadOperation;
//# sourceMappingURL=CompositeConnectionReadOperation.js.map