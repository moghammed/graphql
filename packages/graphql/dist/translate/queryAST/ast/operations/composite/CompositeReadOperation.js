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
exports.CompositeReadOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const operations_1 = require("../operations");
class CompositeReadOperation extends operations_1.Operation {
    constructor({ compositeEntity, children, relationship, }) {
        super();
        this.sortFields = [];
        this.entity = compositeEntity;
        this.children = children;
        this.relationship = relationship;
    }
    getChildren() {
        return this.children;
    }
    transpile(options) {
        const parentNode = options.context.target;
        const nestedSubqueries = this.children.flatMap((c) => {
            const result = c.transpile({
                context: options.context,
                returnVariable: options.returnVariable,
            });
            let clauses = result.clauses;
            if (parentNode) {
                clauses = clauses.map((sq) => cypher_builder_1.default.concat(new cypher_builder_1.default.With("*"), sq));
            }
            return clauses;
        });
        let aggrExpr = cypher_builder_1.default.collect(options.returnVariable);
        if (this.relationship && !this.relationship.isList) {
            aggrExpr = cypher_builder_1.default.head(aggrExpr);
        }
        const nestedSubquery = new cypher_builder_1.default.Call(new cypher_builder_1.default.Union(...nestedSubqueries)).with(options.returnVariable);
        if (this.sortFields.length > 0) {
            nestedSubquery.orderBy(...this.getSortFields(options.context, options.returnVariable));
        }
        if (this.pagination) {
            const paginationField = this.pagination.getPagination();
            if (paginationField) {
                if (paginationField.skip) {
                    nestedSubquery.skip(paginationField.skip);
                }
                if (paginationField.limit) {
                    nestedSubquery.limit(paginationField.limit);
                }
            }
        }
        nestedSubquery.return([aggrExpr, options.returnVariable]);
        return {
            clauses: [nestedSubquery],
            projectionExpr: options.returnVariable,
        };
    }
    addPagination(pagination) {
        this.pagination = pagination;
    }
    addSort(...sortElement) {
        this.sortFields.push(...sortElement);
    }
    getSortFields(context, target) {
        return this.sortFields.flatMap((sf) => sf.getSortFields(context, target, false));
    }
}
exports.CompositeReadOperation = CompositeReadOperation;
//# sourceMappingURL=CompositeReadOperation.js.map