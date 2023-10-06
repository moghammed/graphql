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
exports.getAuthorizationContext = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
async function getAuthorizationContext(context, authorization, jwtClaimsMap) {
    if (!context.jwt && authorization) {
        const jwt = await authorization.decode(context);
        if (jwt) {
            context.jwt = jwt;
            const isAuthenticated = true;
            return {
                isAuthenticated,
                jwt: context.jwt,
                jwtParam: new cypher_builder_1.default.NamedParam("jwt", context.jwt),
                isAuthenticatedParam: new cypher_builder_1.default.NamedParam("isAuthenticated", isAuthenticated),
                claims: jwtClaimsMap,
            };
        }
        else {
            const isAuthenticated = false;
            return {
                isAuthenticated,
                jwtParam: new cypher_builder_1.default.NamedParam("jwt", {}),
                isAuthenticatedParam: new cypher_builder_1.default.NamedParam("isAuthenticated", isAuthenticated),
            };
        }
    }
    const isAuthenticated = true;
    const jwt = context.jwt;
    return {
        isAuthenticated,
        jwt,
        jwtParam: new cypher_builder_1.default.NamedParam("jwt", jwt),
        isAuthenticatedParam: new cypher_builder_1.default.NamedParam("isAuthenticated", isAuthenticated),
    };
}
exports.getAuthorizationContext = getAuthorizationContext;
//# sourceMappingURL=get-authorization-context.js.map