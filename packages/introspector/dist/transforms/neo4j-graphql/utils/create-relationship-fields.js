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
const Relationship_1 = require("../directives/Relationship");
const NodeField_1 = require("../NodeField");
const generate_relationship_field_name_1 = __importDefault(require("./generate-relationship-field-name"));
function createRelationshipFields(fromTypeName, toTypeName, relType, propertiesTypeName, sanitizeRelType) {
    const fromField = new NodeField_1.NodeField((0, generate_relationship_field_name_1.default)(relType, fromTypeName, toTypeName, "OUT", sanitizeRelType), `[${toTypeName}!]!`);
    const fromDirective = new Relationship_1.RelationshipDirective(relType, "OUT", propertiesTypeName);
    fromField.addDirective(fromDirective);
    const toField = new NodeField_1.NodeField((0, generate_relationship_field_name_1.default)(relType, fromTypeName, toTypeName, "IN", sanitizeRelType), `[${fromTypeName}!]!`);
    const toDirective = new Relationship_1.RelationshipDirective(relType, "IN", propertiesTypeName);
    toField.addDirective(toDirective);
    return { fromField, toField };
}
exports.default = createRelationshipFields;
//# sourceMappingURL=create-relationship-fields.js.map