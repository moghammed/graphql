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
exports.CompositeReadPartial = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_node_from_entity_1 = require("../../../utils/create-node-from-entity");
const ReadOperation_1 = require("../ReadOperation");
class CompositeReadPartial extends ReadOperation_1.ReadOperation {
    transpile({ returnVariable, context }) {
        if (this.relationship) {
            return this.transpileNestedCompositeRelationship(this.relationship, { returnVariable, context });
        }
        else {
            throw new Error("Top level interfaces are not supported");
        }
    }
    transpileNestedCompositeRelationship(entity, { returnVariable, context }) {
        const parentNode = context.target;
        const relVar = (0, create_node_from_entity_1.createRelationshipFromEntity)(entity);
        const targetNode = (0, create_node_from_entity_1.createNodeFromEntity)(this.target);
        const relDirection = entity.getCypherDirection(this.directed);
        const pattern = new cypher_builder_1.default.Pattern(parentNode)
            .withoutLabels()
            .related(relVar)
            .withDirection(relDirection)
            .to(targetNode);
        const nestedContext = context.push({ target: targetNode, relationship: relVar });
        const { preSelection, selectionClause: matchClause } = this.getSelectionClauses(nestedContext, pattern);
        const filterPredicates = this.getPredicates(nestedContext);
        const authFilterSubqueries = this.getAuthFilterSubqueries(nestedContext);
        const authFiltersPredicate = this.getAuthFilterPredicate(nestedContext);
        const wherePredicate = cypher_builder_1.default.and(filterPredicates, ...authFiltersPredicate);
        if (wherePredicate) {
            // NOTE: This is slightly different to ReadOperation for cypher compatibility, this could use `WITH *`
            matchClause.where(wherePredicate);
        }
        const subqueries = cypher_builder_1.default.concat(...this.getFieldsSubqueries(nestedContext));
        const sortSubqueries = this.sortFields
            .flatMap((sq) => sq.getSubqueries(nestedContext))
            .map((sq) => new cypher_builder_1.default.Call(sq).innerWith(targetNode));
        const ret = this.getProjectionClause(nestedContext, returnVariable);
        const clause = cypher_builder_1.default.concat(...preSelection, matchClause, ...authFilterSubqueries, subqueries, ...sortSubqueries, ret);
        return {
            clauses: [clause],
            projectionExpr: returnVariable,
        };
    }
    getProjectionClause(context, returnVariable) {
        const projection = this.getProjectionMap(context);
        const targetNodeName = this.target.name;
        projection.set({
            __resolveType: new cypher_builder_1.default.Literal(targetNodeName),
            __id: cypher_builder_1.default.id(context.source), // NOTE: I think this is a bug and should be target
        });
        const withClause = new cypher_builder_1.default.With([projection, context.target]);
        return withClause.return([context.target, returnVariable]);
    }
}
exports.CompositeReadPartial = CompositeReadPartial;
//# sourceMappingURL=CompositeReadPartial.js.map