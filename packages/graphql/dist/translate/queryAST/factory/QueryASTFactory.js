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
exports.QueryASTFactory = void 0;
const QueryAST_1 = require("../ast/QueryAST");
const OperationFactory_1 = require("./OperationFactory");
const TOP_LEVEL_NODE_NAME = "this";
class QueryASTFactory {
    constructor(schemaModel) {
        this.schemaModel = schemaModel;
        this.operationsFactory = new OperationFactory_1.OperationsFactory(this);
    }
    createQueryAST(resolveTree, entity, context) {
        const entityAdapter = this.schemaModel.getConcreteEntityAdapter(entity.name);
        if (!entityAdapter)
            throw new Error(`Entity ${entity.name} not found`);
        const operation = this.operationsFactory.createReadOperation(entityAdapter, resolveTree, context); // TOP level with interfaces is not yet supported
        operation.nodeAlias = TOP_LEVEL_NODE_NAME;
        return new QueryAST_1.QueryAST(operation);
    }
}
exports.QueryASTFactory = QueryASTFactory;
//# sourceMappingURL=QueryASTFactory.js.map