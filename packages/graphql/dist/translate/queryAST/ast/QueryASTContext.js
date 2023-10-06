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
exports.QueryASTContext = exports.QueryASTEnv = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
class QueryASTEnv {
    constructor() {
        this.scopes = new Map();
    }
    getScope(element) {
        const scope = this.scopes.get(element);
        if (scope) {
            return scope;
        }
        else {
            const newScope = new Map();
            this.scopes.set(element, newScope);
            return newScope;
        }
    }
}
exports.QueryASTEnv = QueryASTEnv;
class QueryASTContext {
    constructor({ target, relationship, source, env, neo4jGraphQLContext, }) {
        this.target = target;
        this.relationship = relationship;
        this.source = source;
        this.env = env ?? new QueryASTEnv();
        this.neo4jGraphQLContext = neo4jGraphQLContext;
    }
    getRelationshipScope() {
        if (!this.relationship)
            throw new Error("Cannot get relationship scope on top-level context");
        return this.env.getScope(this.relationship);
    }
    getTargetScope() {
        return this.env.getScope(this.target);
    }
    getScopeVariable(name) {
        const scope = this.getTargetScope();
        const scopeVar = scope.get(name);
        if (!scopeVar) {
            const newVar = new cypher_builder_1.default.Node(); // Using node to keep consistency with `this`
            scope.set(name, newVar);
            return newVar;
        }
        return scopeVar;
    }
    push({ relationship, target }) {
        return new QueryASTContext({
            source: this.target,
            relationship: relationship,
            target: target,
            env: this.env,
            neo4jGraphQLContext: this.neo4jGraphQLContext,
        });
    }
}
exports.QueryASTContext = QueryASTContext;
//# sourceMappingURL=QueryASTContext.js.map