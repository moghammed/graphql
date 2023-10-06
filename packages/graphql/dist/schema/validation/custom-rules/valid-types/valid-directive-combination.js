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
exports.SchemaOrTypeDirectives = exports.DirectiveCombinationValid = void 0;
const graphql_1 = require("graphql");
const invalid_directive_combinations_1 = require("../../utils/invalid-directive-combinations");
const document_validation_error_1 = require("../utils/document-validation-error");
const interface_to_implementing_types_1 = require("../utils/interface-to-implementing-types");
const path_parser_1 = require("../utils/path-parser");
function DirectiveCombinationValid(context) {
    const interfaceToImplementingTypes = new Map();
    const typeToDirectivesPerFieldMap = new Map();
    const typeToDirectivesMap = new Map();
    const hydrateWithDirectives = function (node, parentOfTraversedDef) {
        if (node.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION ||
            node.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION ||
            node.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION ||
            node.kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION) {
            const prev = typeToDirectivesMap.get(node.name.value) || [];
            typeToDirectivesMap.set(node.name.value, prev.concat(node.directives || []));
        }
        if (node.kind === graphql_1.Kind.FIELD_DEFINITION) {
            if (!parentOfTraversedDef) {
                return;
            }
            const seenFields = typeToDirectivesPerFieldMap.get(parentOfTraversedDef.name.value) ||
                new Map();
            seenFields.set(node.name.value, node.directives || []);
            typeToDirectivesPerFieldMap.set(parentOfTraversedDef.name.value, seenFields);
        }
    };
    const getDirectives = function (node, parentOfTraversedDef) {
        const directivesToCheck = [...(node.directives || [])];
        if (node.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION ||
            node.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION ||
            node.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION ||
            node.kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION) {
            // might have been directives on extension
            directivesToCheck.push(...(typeToDirectivesMap.get(node.name.value) || []));
            return (0, interface_to_implementing_types_1.getInheritedTypeNames)(node, interfaceToImplementingTypes).reduce((acc, i) => {
                const inheritedDirectives = typeToDirectivesMap.get(i) || [];
                return acc.concat(inheritedDirectives);
            }, directivesToCheck);
        }
        if (node.kind === graphql_1.Kind.FIELD_DEFINITION) {
            if (!parentOfTraversedDef) {
                return [];
            }
            return (0, interface_to_implementing_types_1.getInheritedTypeNames)(parentOfTraversedDef, interfaceToImplementingTypes).reduce((acc, i) => {
                const inheritedDirectives = typeToDirectivesPerFieldMap.get(i)?.get(node.name.value) || [];
                return acc.concat(inheritedDirectives);
            }, directivesToCheck);
        }
        return directivesToCheck;
    };
    return {
        enter(node, _key, _parent, path, ancestors) {
            if (!("directives" in node) || !node.directives) {
                return;
            }
            const [pathToNode, traversedDef, parentOfTraversedDef] = (0, path_parser_1.getPathToNode)(path, ancestors);
            const currentNodeErrorPath = (0, graphql_1.isTypeDefinitionNode)(node) || (0, graphql_1.isTypeExtensionNode)(node) ? [...pathToNode, node.name.value] : pathToNode;
            (0, interface_to_implementing_types_1.hydrateInterfaceWithImplementedTypesMap)(node, interfaceToImplementingTypes);
            hydrateWithDirectives(node, parentOfTraversedDef);
            const directivesToCheck = getDirectives(node, parentOfTraversedDef);
            if (directivesToCheck.length < 2) {
                // no combination to check
                return;
            }
            const { isValid, errorMsg, errorPath } = (0, document_validation_error_1.assertValid)(() => assertValidDirectives(directivesToCheck, node.kind));
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [traversedDef || node],
                    path: [...currentNodeErrorPath, ...errorPath],
                    errorMsg,
                }));
            }
        },
    };
}
exports.DirectiveCombinationValid = DirectiveCombinationValid;
function getInvalidCombinations(kind) {
    if (kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION || kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION) {
        return invalid_directive_combinations_1.invalidObjectCombinations;
    }
    if (kind === graphql_1.Kind.FIELD_DEFINITION) {
        return invalid_directive_combinations_1.invalidFieldCombinations;
    }
    if (kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION || kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION) {
        return invalid_directive_combinations_1.invalidInterfaceCombinations;
    }
    // Allow user directives to be used anywhere
    return {};
}
function assertValidDirectives(directives, kind) {
    const invalidCombinations = getInvalidCombinations(kind);
    directives.forEach((directive) => {
        if (invalidCombinations[directive.name.value]) {
            directives.forEach((d) => {
                if (d.name.value === directive.name.value) {
                    return;
                }
                if (invalidCombinations[directive.name.value]?.includes(d.name.value)) {
                    throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @${directive.name.value} cannot be used in combination with @${d.name.value}`, []);
                }
            });
        }
    });
}
function SchemaOrTypeDirectives(context) {
    const schemaLevelConfiguration = new Map([
        ["query", false],
        ["mutation", false],
        ["subscription", false],
    ]);
    const typeLevelConfiguration = new Map([
        ["query", false],
        ["mutation", false],
        ["subscription", false],
    ]);
    return {
        enter(node) {
            if (!("directives" in node) || !node.directives) {
                return;
            }
            const isSchemaLevel = node.kind === graphql_1.Kind.SCHEMA_DEFINITION || node.kind === graphql_1.Kind.SCHEMA_EXTENSION;
            const isTypeLevel = (0, graphql_1.isTypeDefinitionNode)(node) || (0, graphql_1.isTypeExtensionNode)(node);
            if (!isSchemaLevel && !isTypeLevel) {
                // only check combination of schema-level and type-level
                return;
            }
            const { isValid, errorMsg } = (0, document_validation_error_1.assertValid)(() => assertSchemaOrType({
                directives: node.directives,
                schemaLevelConfiguration,
                typeLevelConfiguration,
                isSchemaLevel,
                isTypeLevel,
            }));
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [node],
                    errorMsg,
                }));
            }
        },
    };
}
exports.SchemaOrTypeDirectives = SchemaOrTypeDirectives;
function assertSchemaOrType({ directives, schemaLevelConfiguration, typeLevelConfiguration, isSchemaLevel, isTypeLevel, }) {
    directives.forEach((directive) => {
        if (schemaLevelConfiguration.has(directive.name.value)) {
            // only applicable ones: query, mutation, subscription
            if (isSchemaLevel) {
                if (typeLevelConfiguration.get(directive.name.value)) {
                    throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @${directive.name.value} can only be used in one location: either schema or type.`, []);
                }
                schemaLevelConfiguration.set(directive.name.value, true);
            }
            if (isTypeLevel) {
                if (schemaLevelConfiguration.get(directive.name.value)) {
                    throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @${directive.name.value} can only be used in one location: either schema or type.`, []);
                }
                typeLevelConfiguration.set(directive.name.value, true);
            }
        }
    });
}
//# sourceMappingURL=valid-directive-combination.js.map