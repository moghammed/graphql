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
exports.QueryAST = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const QueryASTContext_1 = require("./QueryASTContext");
const create_node_from_entity_1 = require("../utils/create-node-from-entity");
class QueryAST {
    constructor(operation) {
        this.operation = operation;
    }
    transpile(neo4jGraphQLContext) {
        const queryASTEnv = new QueryASTContext_1.QueryASTEnv();
        const node = (0, create_node_from_entity_1.createNodeFromEntity)(this.operation.target, neo4jGraphQLContext, this.operation.nodeAlias);
        const context = new QueryASTContext_1.QueryASTContext({
            target: node,
            env: queryASTEnv,
            neo4jGraphQLContext,
        });
        const result = this.operation.transpile({ context, returnVariable: new cypher_builder_1.default.NamedVariable("this") });
        return cypher_builder_1.default.concat(...result.clauses);
    }
    print() {
        const resultLines = getTreeLines(this.operation);
        return resultLines.join("\n");
    }
}
exports.QueryAST = QueryAST;
function getTreeLines(treeNode, depth = 0) {
    const nodeName = treeNode.print();
    const resultLines = [];
    if (depth === 0) {
        resultLines.push(`${nodeName}`);
    }
    else if (depth === 1) {
        resultLines.push(`|${"────".repeat(depth)} ${nodeName}`);
    }
    else {
        resultLines.push(`|${"    ".repeat(depth - 1)} |──── ${nodeName}`);
    }
    const children = treeNode.getChildren();
    if (children.length > 0) {
        children.forEach((curr) => {
            const childLines = getTreeLines(curr, depth + 1);
            resultLines.push(...childLines);
        });
    }
    return resultLines;
}
//# sourceMappingURL=QueryAST.js.map