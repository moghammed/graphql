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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAuthentication = void 0;
const classes_1 = require("../../../classes");
const constants_1 = require("../../../constants");
const filter_by_values_1 = require("./filter-by-values");
function applyAuthentication({ context, annotation, }) {
    if (!context.authorization.isAuthenticated) {
        throw new classes_1.Neo4jGraphQLError(constants_1.AUTHORIZATION_UNAUTHENTICATED);
    }
    if ("jwt" in annotation && annotation.jwt) {
        const jwt = context.authorization.jwt;
        if (!jwt || !(0, filter_by_values_1.filterByValues)(annotation.jwt, jwt)) {
            throw new classes_1.Neo4jGraphQLError(constants_1.AUTHORIZATION_UNAUTHENTICATED);
        }
    }
}
exports.applyAuthentication = applyAuthentication;
//# sourceMappingURL=apply-authentication.js.map