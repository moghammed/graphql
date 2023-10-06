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
const create_node_fields_1 = __importDefault(require("./utils/create-node-fields"));
const unique_string_1 = __importDefault(require("../../utils/unique-string"));
const Node_1 = require("./directives/Node");
const GraphQLNode_1 = require("./GraphQLNode");
const generate_relationship_props_name_1 = __importDefault(require("./utils/generate-relationship-props-name"));
const RelationshipProperties_1 = require("./directives/RelationshipProperties");
const create_relationship_fields_1 = __importDefault(require("./utils/create-relationship-fields"));
const generate_graphql_safe_name_1 = __importDefault(require("./utils/generate-graphql-safe-name"));
const node_key_1 = __importDefault(require("../../utils/node-key"));
function graphqlFormatter(neo4jStruct, readonly = false, options = {}) {
    const { nodes, relationships } = neo4jStruct;
    const bareNodes = transformNodes(nodes, options);
    const withRelationships = hydrateWithRelationships(bareNodes, relationships, options);
    const sorted = Object.keys(withRelationships).sort((a, b) => {
        return withRelationships[a].typeName > withRelationships[b].typeName ? 1 : -1;
    });
    const sortedWithRelationships = sorted.map((typeName) => withRelationships[typeName].toString());
    if (readonly) {
        sortedWithRelationships.push("extend schema @mutation(operations: [])");
    }
    return sortedWithRelationships.join("\n\n");
}
exports.default = graphqlFormatter;
function transformNodes(nodes, options = {}) {
    const out = {};
    const takenTypeNames = [];
    Object.keys(nodes).forEach((nodeType) => {
        // No labels, skip
        if (!nodeType) {
            return;
        }
        const neo4jNode = nodes[nodeType];
        const neo4jNodeKey = (0, node_key_1.default)(neo4jNode.labels);
        const mainLabel = options.getNodeLabel ? options.getNodeLabel(neo4jNode) : neo4jNode.labels[0];
        const typeName = (0, generate_graphql_safe_name_1.default)(mainLabel);
        const uniqueTypeName = (0, unique_string_1.default)(typeName, takenTypeNames);
        takenTypeNames.push(uniqueTypeName);
        const node = new GraphQLNode_1.GraphQLNode("type", uniqueTypeName);
        const nodeDirective = new Node_1.NodeDirective();
        if (neo4jNode.labels.length > 1 || mainLabel !== uniqueTypeName) {
            nodeDirective.addLabels(neo4jNode.labels);
        }
        if (nodeDirective.toString().length) {
            node.addDirective(nodeDirective);
        }
        const fields = (0, create_node_fields_1.default)(neo4jNode.properties, node.typeName);
        fields.forEach((f) => node.addField(f));
        out[neo4jNodeKey] = node;
    });
    return out;
}
function hydrateWithRelationships(nodes, rels, options = {}) {
    Object.entries(rels).forEach(([relType, rel]) => {
        let relInterfaceName;
        if (rel.properties.length) {
            relInterfaceName = (0, unique_string_1.default)((0, generate_graphql_safe_name_1.default)((0, generate_relationship_props_name_1.default)(relType)), Object.values(nodes).map((n) => n.typeName));
            const relInterfaceNode = new GraphQLNode_1.GraphQLNode("interface", relInterfaceName);
            relInterfaceNode.addDirective(new RelationshipProperties_1.RelationshipPropertiesDirective());
            const relTypePropertiesFields = (0, create_node_fields_1.default)(rel.properties, relType);
            relTypePropertiesFields.forEach((f) => relInterfaceNode.addField(f));
            nodes[relInterfaceName] = relInterfaceNode;
        }
        // console.dir(rel, { depth: 7 });
        rel.paths.forEach((path) => {
            const { fromField, toField } = (0, create_relationship_fields_1.default)(nodes[path.fromTypeId].typeName, nodes[path.toTypeId].typeName, relType, relInterfaceName, options.sanitizeRelType);
            nodes[path.fromTypeId].addField(fromField);
            nodes[path.toTypeId].addField(toField);
        });
    });
    Object.keys(nodes).forEach((key) => {
        if (!nodes[key].fields.length) {
            delete nodes[key];
        }
    });
    return nodes;
}
//# sourceMappingURL=graphql.js.map