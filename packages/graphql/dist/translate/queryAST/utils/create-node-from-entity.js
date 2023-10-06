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
exports.createRelationshipFromEntity = exports.createNodeFromEntity = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const map_labels_with_context_1 = require("../../../schema-model/utils/map-labels-with-context");
function createNodeFromEntity(entity, neo4jGraphQLContext, name) {
    const labels = neo4jGraphQLContext
        ? (0, map_labels_with_context_1.mapLabelsWithContext)(entity.getLabels(), neo4jGraphQLContext)
        : entity.getLabels();
    if (name) {
        return new cypher_builder_1.default.NamedNode(name, { labels });
    }
    return new cypher_builder_1.default.Node({
        labels,
    });
}
exports.createNodeFromEntity = createNodeFromEntity;
function createRelationshipFromEntity(rel, name) {
    if (name) {
        return new cypher_builder_1.default.NamedRelationship(name, { type: rel.type });
    }
    return new cypher_builder_1.default.Relationship({
        type: rel.type,
    });
}
exports.createRelationshipFromEntity = createRelationshipFromEntity;
//# sourceMappingURL=create-node-from-entity.js.map