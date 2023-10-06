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
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
const constants_1 = require("../constants");
const utils_1 = require("../utils/utils");
const CallbackBucket_1 = require("../classes/CallbackBucket");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const unwind_create_1 = __importDefault(require("./unwind-create"));
const types_1 = require("./batch-create/types");
const compile_cypher_1 = require("../utils/compile-cypher");
const get_authorization_statements_1 = require("./utils/get-authorization-statements");
async function translateCreate({ context, node, }) {
    const { resolveTree } = context;
    const mutationInputs = resolveTree.args.input;
    try {
        return await (0, unwind_create_1.default)({ context, node });
    }
    catch (error) {
        if (!(error instanceof types_1.UnsupportedUnwindOptimization)) {
            throw error;
        }
    }
    const projectionWith = [];
    const callbackBucket = new CallbackBucket_1.CallbackBucket(context);
    const mutationResponse = resolveTree.fieldsByTypeName[node.mutationResponseTypeNames.create];
    const nodeProjection = Object.values(mutationResponse).find((field) => field.name === node.plural);
    const metaNames = [];
    // TODO: after the createCreateAndParams refactor, remove varNameStrs and only use Cypher Variables
    const varNameStrs = mutationInputs.map((_, i) => `this${i}`);
    const varNameVariables = varNameStrs.map((varName) => new cypher_builder_1.default.NamedNode(varName));
    const { createStrs, params } = mutationInputs.reduce((res, input, index) => {
        const varName = varNameStrs[index];
        const create = [`CALL {`];
        const withVars = [varName];
        projectionWith.push(varName);
        if (context.subscriptionsEnabled) {
            create.push(`WITH [] AS ${constants_1.META_CYPHER_VARIABLE}`);
            withVars.push(constants_1.META_CYPHER_VARIABLE);
        }
        const { create: nestedCreate, params, authorizationPredicates, authorizationSubqueries, } = (0, create_create_and_params_1.default)({
            input,
            node,
            context,
            varName,
            withVars,
            includeRelationshipValidation: true,
            topLevelNodeVariable: varName,
            callbackBucket,
        });
        create.push(nestedCreate);
        create.push(...(0, get_authorization_statements_1.getAuthorizationStatements)(authorizationPredicates, authorizationSubqueries));
        if (context.subscriptionsEnabled) {
            const metaVariable = `${varName}_${constants_1.META_CYPHER_VARIABLE}`;
            create.push(`RETURN ${varName}, ${constants_1.META_CYPHER_VARIABLE} AS ${metaVariable}`);
            metaNames.push(metaVariable);
        }
        else {
            create.push(`RETURN ${varName}`);
        }
        create.push(`}`);
        res.createStrs.push(create.join("\n"));
        res.params = { ...res.params, ...params };
        return res;
    }, { createStrs: [], params: {}, withVars: [] });
    if (metaNames.length > 0) {
        projectionWith.push(`${metaNames.join(" + ")} AS meta`);
    }
    let parsedProjection;
    if (nodeProjection) {
        const projectionFromInput = varNameVariables.map((varName) => {
            const projection = (0, create_projection_and_params_1.default)({
                node,
                context,
                resolveTree: nodeProjection,
                varName,
                cypherFieldAliasMap: {},
            });
            const projectionExpr = new cypher_builder_1.default.RawCypher((env) => `${(0, compile_cypher_1.compileCypher)(varName, env)} ${(0, compile_cypher_1.compileCypher)(projection.projection, env)}`);
            const projectionSubquery = cypher_builder_1.default.concat(...projection.subqueriesBeforeSort, ...projection.subqueries);
            const authPredicates = [];
            if (projection.predicates.length) {
                authPredicates.push(cypher_builder_1.default.and(...projection.predicates));
            }
            if (authPredicates.length) {
                return {
                    projection: projectionExpr,
                    projectionSubqueries: projectionSubquery,
                    projectionAuth: cypher_builder_1.default.and(...authPredicates),
                };
            }
            return { projection: projectionExpr, projectionSubqueries: projectionSubquery };
        });
        parsedProjection = projectionFromInput.reduce((acc, { projection, projectionSubqueries, authPredicate }) => {
            return {
                authPredicates: authPredicate ? [...acc.authPredicates, authPredicate] : acc.authPredicates,
                projectionSubqueriesClause: cypher_builder_1.default.concat(acc.projectionSubqueriesClause, projectionSubqueries),
                projectionList: acc.projectionList.concat(projection),
            };
        }, {
            projectionSubqueriesClause: undefined,
            projectionList: [],
            authPredicates: [],
        });
    }
    const projectionList = parsedProjection?.projectionList.length
        ? new cypher_builder_1.default.List(parsedProjection.projectionList)
        : undefined;
    const returnStatement = generateCreateReturnStatement(projectionList, context.subscriptionsEnabled);
    const createQuery = new cypher_builder_1.default.RawCypher((env) => {
        const projectionSubqueriesStr = (0, compile_cypher_1.compileCypherIfExists)(parsedProjection?.projectionSubqueriesClause, env);
        const cypher = (0, utils_1.filterTruthy)([
            `${createStrs.join("\n")}`,
            context.subscriptionsEnabled ? `WITH ${projectionWith.join(", ")}` : "",
            parsedProjection?.authPredicates.length
                ? (0, compile_cypher_1.compileCypher)(new cypher_builder_1.default.With("*").where(cypher_builder_1.default.and(...parsedProjection.authPredicates)), env)
                : "",
            projectionSubqueriesStr ? `\n${projectionSubqueriesStr}` : "",
            (0, compile_cypher_1.compileCypher)(returnStatement, env),
        ])
            .filter(Boolean)
            .join("\n");
        return [
            cypher,
            {
                ...params,
            },
        ];
    });
    const createQueryCypher = createQuery.build("create_");
    const { cypher, params: resolvedCallbacks } = await callbackBucket.resolveCallbacksAndFilterCypher({
        cypher: createQueryCypher.cypher,
    });
    const result = {
        cypher,
        params: {
            ...createQueryCypher.params,
            resolvedCallbacks,
        },
    };
    return result;
}
exports.default = translateCreate;
function generateCreateReturnStatement(projectionExpr, subscriptionsEnabled) {
    const statements = new cypher_builder_1.default.RawCypher((env) => {
        let statStr;
        if (projectionExpr) {
            statStr = `${(0, compile_cypher_1.compileCypher)(projectionExpr, env)} AS data`;
        }
        if (subscriptionsEnabled) {
            statStr = statStr ? `${statStr}, ${constants_1.META_CYPHER_VARIABLE}` : constants_1.META_CYPHER_VARIABLE;
        }
        if (!statStr) {
            statStr = "'Query cannot conclude with CALL'";
        }
        return statStr;
    });
    return new cypher_builder_1.default.Return(statements);
}
//# sourceMappingURL=translate-create.js.map