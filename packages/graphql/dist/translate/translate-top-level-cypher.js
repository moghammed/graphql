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
exports.translateTopLevelCypher = void 0;
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const constants_1 = require("../constants");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const classes_1 = require("../classes");
const filter_by_values_1 = require("./authorization/utils/filter-by-values");
const compile_cypher_1 = require("../utils/compile-cypher");
const apply_authentication_1 = require("./authorization/utils/apply-authentication");
function translateTopLevelCypher({ context, field, args, type, statement, }) {
    const operation = context.schemaModel.operations[type];
    if (!operation) {
        throw new Error(`Failed to find operation ${type} in Schema Model.`);
    }
    const operationField = operation.findAttribute(field.fieldName);
    if (!operationField) {
        throw new Error(`Failed to find field ${field.fieldName} on operation ${type}.`);
    }
    const annotation = operationField.annotations.authentication;
    if (annotation) {
        (0, apply_authentication_1.applyAuthentication)({ context, annotation });
    }
    const authorizationAnnotation = operationField.annotations.authorization;
    if (authorizationAnnotation) {
        const authorizationResults = authorizationAnnotation.validate?.map((rule) => (0, filter_by_values_1.filterByValues)(rule.where, { jwt: context.authorization.jwt }));
        if (authorizationResults?.every((result) => result === false)) {
            throw new classes_1.Neo4jGraphQLError(constants_1.AUTHORIZATION_UNAUTHENTICATED);
        }
    }
    const { resolveTree } = context;
    let params = args;
    if (statement.includes("$jwt")) {
        params.jwt = context.authorization.jwtParam.value;
    }
    const cypherStrs = [];
    let projectionStr;
    const projectionAuthStrs = [];
    const projectionValidatePredicates = [];
    const projectionSubqueries = [];
    const referenceNode = context.nodes.find((x) => x.name === field.typeMeta.name);
    if (referenceNode) {
        const { projection: str, params: p, subqueries, subqueriesBeforeSort, predicates, } = (0, create_projection_and_params_1.default)({
            resolveTree,
            node: referenceNode,
            context,
            varName: new cypher_builder_1.default.NamedNode(`this`),
            cypherFieldAliasMap: {},
        });
        projectionStr = str;
        projectionSubqueries.push(...subqueriesBeforeSort, ...subqueries);
        params = { ...params, ...p };
        if (predicates.length) {
            projectionValidatePredicates.push(...predicates);
        }
    }
    const unionWhere = [];
    const entity = context.schemaModel.entities.get(field.typeMeta.name);
    if (entity?.isCompositeEntity()) {
        const headStrs = [];
        const referencedNodes = entity.concreteEntities
            ?.map((u) => context.nodes.find((n) => n.name === u.name))
            ?.filter((b) => b !== undefined)
            ?.filter((n) => Object.keys(resolveTree.fieldsByTypeName).includes(n?.name ?? "")) || [];
        referencedNodes.forEach((node) => {
            if (node) {
                const labelsStatements = node.getLabels(context).map((label, index) => {
                    const param = `${node.name}_labels${index}`;
                    params[param] = label;
                    return `$${param} IN labels(this)`;
                });
                unionWhere.push(`(${labelsStatements.join("AND")})`);
                // TODO Migrate to CypherBuilder
                const innerNodePartialProjection = `[ this IN [this] WHERE (${labelsStatements.join(" AND ")})`;
                if (!resolveTree.fieldsByTypeName[node.name]) {
                    headStrs.push(new cypher_builder_1.default.RawCypher(`${innerNodePartialProjection}| this { __resolveType: "${node.name}" }]`));
                }
                else {
                    const { projection: str, params: p, subqueries, predicates, } = (0, create_projection_and_params_1.default)({
                        resolveTree,
                        node,
                        context,
                        varName: new cypher_builder_1.default.NamedNode("this"),
                        cypherFieldAliasMap: {},
                    });
                    projectionSubqueries.push(...subqueries);
                    params = { ...params, ...p };
                    if (predicates.length) {
                        projectionValidatePredicates.push(...predicates);
                    }
                    headStrs.push(new cypher_builder_1.default.RawCypher((env) => {
                        return innerNodePartialProjection
                            .concat(`| this { __resolveType: "${node.name}", `)
                            .concat((0, compile_cypher_1.compileCypher)(str, env).replace("{", ""))
                            .concat("]");
                    }));
                }
            }
        });
        projectionStr = new cypher_builder_1.default.RawCypher((env) => `${headStrs.map((headStr) => (0, compile_cypher_1.compileCypher)(headStr, env)).join(" + ")}`);
    }
    // Null default argument values are not passed into the resolve tree therefore these are not being passed to
    // `apocParams` below causing a runtime error when executing.
    const nullArgumentValues = field.arguments.reduce((res, argument) => ({
        ...res,
        ...{ [argument.name.value]: null },
    }), {});
    const apocParams = Object.entries({ ...nullArgumentValues, ...resolveTree.args }).reduce((result, entry) => ({
        params: { ...result.params, [entry[0]]: entry[1] },
    }), { params });
    params = { ...params, ...apocParams.params };
    if (type === "Query") {
        const cypherStatement = createCypherDirectiveSubquery({
            field,
        });
        cypherStrs.push(...cypherStatement);
    }
    else {
        const columnName = field.columnName;
        cypherStrs.push(`
            CALL {
                ${statement}
            }
            WITH ${columnName} AS this
        
        `);
    }
    if (unionWhere.length) {
        cypherStrs.push(`WHERE ${unionWhere.join(" OR ")}`);
    }
    const projectionSubquery = cypher_builder_1.default.concat(...projectionSubqueries);
    return new cypher_builder_1.default.RawCypher((env) => {
        const authPredicates = [];
        if (projectionValidatePredicates.length) {
            authPredicates.push(cypher_builder_1.default.and(...projectionValidatePredicates));
        }
        if (projectionAuthStrs.length) {
            const validatePred = cypher_builder_1.default.apoc.util.validatePredicate(cypher_builder_1.default.not(cypher_builder_1.default.and(...projectionAuthStrs)), constants_1.AUTH_FORBIDDEN_ERROR);
            authPredicates.push(validatePred);
        }
        if (authPredicates.length) {
            cypherStrs.push(`WHERE ${(0, compile_cypher_1.compileCypher)(cypher_builder_1.default.and(...authPredicates), env)}`);
        }
        const subqueriesStr = projectionSubquery ? `\n${(0, compile_cypher_1.compileCypher)(projectionSubquery, env)}` : "";
        if (subqueriesStr)
            cypherStrs.push(subqueriesStr);
        if (field.isScalar || field.isEnum) {
            cypherStrs.push(`RETURN this`);
        }
        else if (entity?.isCompositeEntity()) {
            cypherStrs.push(`RETURN head( ${projectionStr.getCypher(env)} ) AS this`);
        }
        else {
            cypherStrs.push(`RETURN this ${projectionStr.getCypher(env)} AS this`);
        }
        return [cypherStrs.join("\n"), params];
    }).build();
}
exports.translateTopLevelCypher = translateTopLevelCypher;
function createCypherDirectiveSubquery({ field }) {
    const cypherStrs = [];
    cypherStrs.push("CALL {", field.statement, "}");
    if (field.columnName) {
        if (field.isScalar || field.isEnum) {
            cypherStrs.push(`UNWIND ${field.columnName} as this`);
        }
        else {
            cypherStrs.push(`WITH ${field.columnName} as this`);
        }
    }
    return cypherStrs;
}
//# sourceMappingURL=translate-top-level-cypher.js.map