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
const types_1 = require("./batch-create/types");
const parser_1 = require("./batch-create/parser");
const UnwindCreateVisitor_1 = require("./batch-create/unwind-create-visitors/UnwindCreateVisitor");
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const constants_1 = require("../constants");
const utils_1 = require("../utils/utils");
const CallbackBucket_1 = require("../classes/CallbackBucket");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const compile_cypher_1 = require("../utils/compile-cypher");
async function unwindCreate({ context, node, }) {
    if (context.subscriptionsEnabled) {
        throw new types_1.UnsupportedUnwindOptimization("Unwind create optimisation does not yet support subscriptions");
    }
    const { resolveTree } = context;
    const input = resolveTree.args.input;
    const treeDescriptor = Array.isArray(input)
        ? (0, parser_1.mergeTreeDescriptors)(input.map((el) => (0, parser_1.getTreeDescriptor)(el, node, context)))
        : (0, parser_1.getTreeDescriptor)(input, node, context);
    const createNodeAST = (0, parser_1.parseCreate)(treeDescriptor, node, context);
    const callbackBucket = new CallbackBucket_1.CallbackBucket(context);
    const unwindVar = new cypher_builder_1.default.Variable();
    const unwind = new cypher_builder_1.default.Param(input);
    const unwindQuery = new cypher_builder_1.default.Unwind([unwind, unwindVar]);
    const unwindCreateVisitor = new UnwindCreateVisitor_1.UnwindCreateVisitor(unwindVar, callbackBucket, context);
    createNodeAST.accept(unwindCreateVisitor);
    const [rootNodeVariable, createCypher] = unwindCreateVisitor.build();
    const projectionWith = [];
    let predicates = [];
    const mutationResponse = resolveTree.fieldsByTypeName[node.mutationResponseTypeNames.create] || {};
    const nodeProjection = Object.values(mutationResponse).find((field) => field.name === node.plural);
    const metaNames = [];
    let projectionCypher;
    if (metaNames.length > 0) {
        projectionWith.push(`${metaNames.join(" + ")} AS meta`);
    }
    let projectionSubquery;
    if (nodeProjection) {
        const projection = (0, create_projection_and_params_1.default)({
            node,
            context,
            resolveTree: nodeProjection,
            varName: rootNodeVariable,
            cypherFieldAliasMap: {},
        });
        projectionSubquery = cypher_builder_1.default.concat(...projection.subqueries);
        projectionCypher = new cypher_builder_1.default.RawCypher((env) => {
            return `${(0, compile_cypher_1.compileCypher)(rootNodeVariable, env)} ${(0, compile_cypher_1.compileCypher)(projection.projection, env)}`;
        });
        predicates = projection.predicates;
    }
    const unwindCreate = cypher_builder_1.default.concat(unwindQuery, createCypher);
    const returnStatement = generateCreateReturnStatementCypher(projectionCypher, context.subscriptionsEnabled);
    const projectionWithStr = context.subscriptionsEnabled ? `WITH ${projectionWith.join(", ")}` : "";
    let withWhere;
    if (predicates.length) {
        withWhere = new cypher_builder_1.default.With("*").where(cypher_builder_1.default.and(...predicates));
    }
    const createQuery = new cypher_builder_1.default.RawCypher((env) => {
        const projectionSubqueryStr = (0, compile_cypher_1.compileCypherIfExists)(projectionSubquery, env);
        const withWhereStr = (0, compile_cypher_1.compileCypherIfExists)(withWhere, env);
        const cypher = (0, utils_1.filterTruthy)([
            (0, compile_cypher_1.compileCypher)(unwindCreate, env),
            projectionWithStr,
            projectionSubqueryStr,
            withWhereStr,
            (0, compile_cypher_1.compileCypher)(returnStatement, env),
        ])
            .filter(Boolean)
            .join("\n");
        return cypher;
    });
    const createQueryCypher = createQuery.build("create_");
    const { cypher, params: resolvedCallbacks } = await callbackBucket.resolveCallbacksAndFilterCypher({
        cypher: createQueryCypher.cypher,
    });
    return {
        cypher,
        params: {
            ...createQueryCypher.params,
            resolvedCallbacks,
        },
    };
}
exports.default = unwindCreate;
function generateCreateReturnStatementCypher(projection, subscriptionsEnabled) {
    return new cypher_builder_1.default.RawCypher((env) => {
        const statements = [];
        if (projection) {
            statements.push(`collect(${(0, compile_cypher_1.compileCypher)(projection, env)}) AS data`);
        }
        if (subscriptionsEnabled) {
            statements.push(constants_1.META_CYPHER_VARIABLE);
        }
        if (statements.length === 0) {
            statements.push("'Query cannot conclude with CALL'");
        }
        return `RETURN ${statements.join(", ")}`;
    });
}
//# sourceMappingURL=unwind-create.js.map