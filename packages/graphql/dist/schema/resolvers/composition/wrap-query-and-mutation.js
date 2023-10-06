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
exports.wrapQueryAndMutation = void 0;
const debug_1 = __importDefault(require("debug"));
const graphql_1 = require("graphql");
const Neo4jDatabaseInfo_1 = require("../../../classes/Neo4jDatabaseInfo");
const Executor_1 = require("../../../classes/Executor");
const constants_1 = require("../../../constants");
const get_authorization_context_1 = require("./utils/get-authorization-context");
const debug = (0, debug_1.default)(constants_1.DEBUG_GRAPHQL);
let neo4jDatabaseInfo;
const wrapQueryAndMutation = ({ driver, nodes, relationships, jwtPayloadFieldsMap, schemaModel, dbInfo, authorization, features, }) => (next) => async (root, args, context, info) => {
    if (debug.enabled) {
        const query = (0, graphql_1.print)(info.operation);
        debug("%s", `Incoming GraphQL:\nQuery:\n${query}\nVariables:\n${JSON.stringify(info.variableValues, null, 2)}`);
    }
    if (!context?.executionContext) {
        if (!driver) {
            throw new Error("A Neo4j driver instance must either be passed to Neo4jGraphQL on construction, or a driver, session or transaction passed as context.executionContext in each request.");
        }
        context.executionContext = driver;
    }
    const subscriptionsEnabled = Boolean(features.subscriptions);
    const authorizationContext = await (0, get_authorization_context_1.getAuthorizationContext)(context, authorization, jwtPayloadFieldsMap);
    if (!context.jwt) {
        context.jwt = authorizationContext.jwt;
    }
    const executor = new Executor_1.Executor({
        executionContext: context.executionContext,
        cypherQueryOptions: context.cypherQueryOptions,
        sessionConfig: context.sessionConfig,
        cypherParams: context.cypherParams,
        transactionMetadata: context.transactionMetadata,
    });
    if (dbInfo) {
        neo4jDatabaseInfo = dbInfo;
    }
    if (!neo4jDatabaseInfo?.version) {
        neo4jDatabaseInfo = await (0, Neo4jDatabaseInfo_1.getNeo4jDatabaseInfo)(executor);
    }
    const internalContext = {
        nodes,
        relationships,
        schemaModel,
        features,
        subscriptionsEnabled,
        executor,
        neo4jDatabaseInfo,
        authorization: authorizationContext,
        // Consider anything in here overrides
        ...context,
    };
    return next(root, args, { ...context, ...internalContext }, info);
};
exports.wrapQueryAndMutation = wrapQueryAndMutation;
//# sourceMappingURL=wrap-query-and-mutation.js.map