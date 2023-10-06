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
exports.getUserDefinedDirectives = void 0;
const constants_1 = require("../../constants");
const is_in_array_1 = require("../../utils/is-in-array");
function getUserDefinedMergedFieldDirectivesForDefinition(definitionNode, definitionNodes) {
    const userDefinedFieldDirectives = new Map();
    const allFields = [...(definitionNode.fields || [])];
    /**
     * TODO [directive-inheritance]
     * is it a good idea to inherit the field directives from implemented interfaces?
     * makes sense for deprecated but for other user-defined directives?
     */
    if (definitionNode.interfaces) {
        for (const inheritsFrom of definitionNode.interfaces) {
            const interfaceDefinition = definitionNodes.interfaceTypes.find((type) => type.name.value === inheritsFrom.name.value);
            const inheritedFields = interfaceDefinition?.fields;
            if (inheritedFields) {
                allFields.push(...inheritedFields);
            }
        }
    }
    for (const field of allFields) {
        if (!field.directives) {
            return userDefinedFieldDirectives;
        }
        const matched = field.directives.filter((directive) => !(0, is_in_array_1.isInArray)(constants_1.FIELD_DIRECTIVES, directive.name.value));
        if (matched.length) {
            userDefinedFieldDirectives.set(field.name.value, matched);
        }
    }
    return userDefinedFieldDirectives;
}
/**
 * TODO [directive-inheritance]
 * should directives be inherited?? they are user-defined after all.
 * other considerations might apply to PROPAGATED_DIRECTIVES: deprecated and shareable
 * ATM we only test deprecated propagates
 */
function getUserDefinedDirectives(definitionNodes) {
    const userDefinedFieldDirectivesForNode = new Map();
    const userDefinedDirectivesForNode = new Map();
    const propagatedDirectivesForNode = new Map();
    const userDefinedDirectivesForInterface = new Map();
    for (const definitionNode of definitionNodes.objectTypes) {
        const userDefinedObjectDirectives = definitionNode.directives?.filter((directive) => !(0, is_in_array_1.isInArray)(constants_1.OBJECT_DIRECTIVES, directive.name.value)) || [];
        const propagatedDirectives = definitionNode.directives?.filter((directive) => (0, is_in_array_1.isInArray)(constants_1.PROPAGATED_DIRECTIVES, directive.name.value)) ||
            [];
        userDefinedDirectivesForNode.set(definitionNode.name.value, userDefinedObjectDirectives);
        propagatedDirectivesForNode.set(definitionNode.name.value, propagatedDirectives);
        const userDefinedFieldDirectives = getUserDefinedMergedFieldDirectivesForDefinition(definitionNode, definitionNodes);
        userDefinedFieldDirectivesForNode.set(definitionNode.name.value, userDefinedFieldDirectives);
    }
    for (const definitionNode of definitionNodes.interfaceTypes) {
        const userDefinedInterfaceDirectives = definitionNode.directives?.filter((directive) => !(0, is_in_array_1.isInArray)(constants_1.INTERFACE_DIRECTIVES, directive.name.value)) ||
            [];
        userDefinedDirectivesForInterface.set(definitionNode.name.value, userDefinedInterfaceDirectives);
        const userDefinedFieldDirectives = getUserDefinedMergedFieldDirectivesForDefinition(definitionNode, definitionNodes);
        userDefinedFieldDirectivesForNode.set(definitionNode.name.value, userDefinedFieldDirectives);
    }
    for (const definitionNode of definitionNodes.operations) {
        const userDefinedFieldDirectives = getUserDefinedMergedFieldDirectivesForDefinition(definitionNode, definitionNodes);
        userDefinedFieldDirectivesForNode.set(definitionNode.name.value, userDefinedFieldDirectives);
    }
    return {
        userDefinedFieldDirectivesForNode,
        userDefinedDirectivesForNode,
        propagatedDirectivesForNode,
        userDefinedDirectivesForInterface,
    };
}
exports.getUserDefinedDirectives = getUserDefinedDirectives;
//# sourceMappingURL=user-defined-directives.js.map