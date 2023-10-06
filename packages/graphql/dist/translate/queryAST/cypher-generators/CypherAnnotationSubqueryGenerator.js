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
exports.CypherAnnotationSubqueryGenerator = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const QueryASTContext_1 = require("../ast/QueryASTContext");
const is_cypher_node_1 = require("../utils/is-cypher-node");
const wrap_subquery_in_call_1 = require("../utils/wrap-subquery-in-call");
/** Variable exposed to the user in their custom cypher */
const CYPHER_TARGET_VARIABLE = new cypher_builder_1.default.NamedVariable("this");
class CypherAnnotationSubqueryGenerator {
    constructor({ context, attribute }) {
        const cypherAnnotation = attribute.annotations.cypher;
        if (!cypherAnnotation)
            throw new Error("Missing Cypher Annotation on Cypher field");
        this.cypherAnnotation = cypherAnnotation;
        this.attribute = attribute;
        this.context = context;
        this.columnName = new cypher_builder_1.default.NamedVariable(cypherAnnotation.columnName);
        this.returnVariable = context.getScopeVariable(attribute.name);
    }
    createSubqueryForCypherAnnotation({ rawArguments = {}, extraParams = {}, nestedFields, subqueries = [], projectionFields, }) {
        const statementSubquery = this.createCypherStatementSubquery({
            rawArguments,
            extraParams,
        });
        const nestedFieldsSubqueries = this.getNestedFieldsSubquery(nestedFields);
        const returnProjection = this.getProjectionExpression({
            fields: projectionFields,
            nestedFields,
        });
        const returnStatement = new cypher_builder_1.default.Return([returnProjection, this.returnVariable]);
        return cypher_builder_1.default.concat(statementSubquery, nestedFieldsSubqueries, ...subqueries, returnStatement);
    }
    createSubqueryForCypherAnnotationUnion({ rawArguments = {}, extraParams = {}, nestedFields, subqueries = [], unionPartials, }) {
        const statementSubquery = this.createCypherStatementSubquery({
            rawArguments,
            extraParams,
        });
        const nestedFieldsSubqueries = this.getNestedFieldsSubquery(nestedFields);
        const unionPredicates = unionPartials.map((partial) => partial.getFilterPredicate(this.returnVariable));
        const unionPredicatesFilter = new cypher_builder_1.default.With("*").where(cypher_builder_1.default.or(...unionPredicates));
        const returnProjection = this.getProjectionExpressionForUnionPartials(unionPartials);
        const returnStatement = new cypher_builder_1.default.Return([returnProjection, this.returnVariable]);
        return cypher_builder_1.default.concat(statementSubquery, nestedFieldsSubqueries, unionPredicatesFilter, ...subqueries, returnStatement);
    }
    createCypherStatementSubquery({ rawArguments, extraParams, }) {
        const target = this.context.target;
        const aliasTargetToPublicTarget = new cypher_builder_1.default.With([target, CYPHER_TARGET_VARIABLE]);
        const statementCypherQuery = new cypher_builder_1.default.RawCypher((env) => {
            const statement = this.replaceArgumentsInStatement({
                env,
                rawArguments,
            });
            return [statement, extraParams];
        });
        const statementSubquery = cypher_builder_1.default.concat(aliasTargetToPublicTarget, statementCypherQuery);
        const callStatement = new cypher_builder_1.default.Call(statementSubquery).innerWith(target);
        if (this.attribute.typeHelper.isScalar() || this.attribute.typeHelper.isEnum()) {
            callStatement.unwind([this.columnName, this.returnVariable]);
        }
        else {
            callStatement.with([this.columnName, this.returnVariable]);
        }
        return callStatement;
    }
    replaceArgumentsInStatement({ env, rawArguments, }) {
        let cypherStatement = this.cypherAnnotation.statement;
        this.attribute.args.forEach((arg) => {
            const value = rawArguments[arg.name];
            if (value) {
                const paramName = new cypher_builder_1.default.Param(value).getCypher(env);
                cypherStatement = cypherStatement.replaceAll(`$${arg.name}`, paramName);
            }
            else {
                cypherStatement = cypherStatement.replaceAll(`$${arg.name}`, "NULL");
            }
        });
        return cypherStatement;
    }
    getNestedFieldsSubquery(nestedFields) {
        const target = this.returnVariable;
        if (!nestedFields)
            return undefined;
        (0, is_cypher_node_1.assertIsCypherNode)(target);
        const nestedContext = new QueryASTContext_1.QueryASTContext({
            target,
            env: this.context.env,
            neo4jGraphQLContext: this.context.neo4jGraphQLContext,
        });
        const nodeProjectionSubqueries = nestedFields.flatMap((field) => {
            return field.getSubqueries(nestedContext).map((sq) => (0, wrap_subquery_in_call_1.wrapSubqueryInCall)(sq, target));
        });
        return cypher_builder_1.default.concat(...nodeProjectionSubqueries);
    }
    getProjectionExpression({ fields, nestedFields, }) {
        let projection = this.returnVariable;
        // nested fields are presents only if the attribute is an object or an abstract type, and they produce a different projection
        if (nestedFields) {
            projection = this.getNestedFieldsProjectionMap(nestedFields, this.returnVariable);
        }
        else if (fields) {
            projection = this.getFieldsProjectionMap(fields, this.returnVariable);
        }
        const collectedProjection = cypher_builder_1.default.collect(projection);
        if (!this.attribute.typeHelper.isList()) {
            return cypher_builder_1.default.head(collectedProjection);
        }
        return collectedProjection;
    }
    getProjectionExpressionForUnionPartials(unionPartials) {
        const caseClause = new cypher_builder_1.default.Case();
        for (const partial of unionPartials) {
            const projection = partial.getProjectionExpression(this.returnVariable);
            const predicate = partial.getFilterPredicate(this.returnVariable);
            caseClause.when(predicate).then(projection);
        }
        const collectedProjection = cypher_builder_1.default.collect(caseClause);
        if (!this.attribute.typeHelper.isList()) {
            return cypher_builder_1.default.head(collectedProjection);
        }
        return collectedProjection;
    }
    getNestedFieldsProjectionMap(fields, fromVariable) {
        const projection = new cypher_builder_1.default.MapProjection(fromVariable);
        for (const field of fields) {
            const fieldProjection = field.getProjectionField(fromVariable);
            projection.set(fieldProjection);
        }
        return projection;
    }
    getFieldsProjectionMap(fields, fromVariable) {
        const projection = new cypher_builder_1.default.MapProjection(fromVariable);
        for (const [alias, name] of Object.entries(fields)) {
            if (alias === name)
                projection.set(alias);
            else {
                projection.set({
                    [alias]: fromVariable.property(name),
                });
            }
        }
        return projection;
    }
}
exports.CypherAnnotationSubqueryGenerator = CypherAnnotationSubqueryGenerator;
//# sourceMappingURL=CypherAnnotationSubqueryGenerator.js.map