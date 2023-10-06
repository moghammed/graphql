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
exports.augmentWhereInputTypeWithConnectionFields = exports.augmentWhereInputTypeWithRelationshipFields = void 0;
const constants_1 = require("../../constants");
function augmentWhereInputType({ whereType, fieldName, filters, relationshipAdapter, deprecatedDirectives, }) {
    const fields = {};
    if (!relationshipAdapter.isFilterableByValue()) {
        return fields;
    }
    fields[fieldName] = {
        type: whereType,
    };
    fields[`${fieldName}_NOT`] = {
        type: whereType,
    };
    if (filters) {
        for (const filterField of filters) {
            fields[filterField.type] = {
                type: whereType,
                directives: deprecatedDirectives,
                // e.g. "Return Movies where all of the related Actors match this filter"
                description: filterField.description,
            };
            // TODO: are these deprecations still relevant?
            // only adding these for the deprecation message. If no deprecation anymore, delete them.
            fields[fieldName] = {
                type: whereType,
                directives: [
                    {
                        name: constants_1.DEPRECATED,
                        args: { reason: `Use \`${fieldName}_SOME\` instead.` },
                    },
                ],
            };
            fields[`${fieldName}_NOT`] = {
                type: whereType,
                directives: [
                    {
                        name: constants_1.DEPRECATED,
                        args: { reason: `Use \`${fieldName}_NONE\` instead.` },
                    },
                ],
            };
        }
    }
    return fields;
}
function augmentWhereInputTypeWithRelationshipFields(relationshipAdapter, deprecatedDirectives) {
    return augmentWhereInputType({
        whereType: relationshipAdapter.target.operations.whereInputTypeName,
        fieldName: relationshipAdapter.name,
        filters: relationshipAdapter.listFiltersModel?.filters,
        relationshipAdapter,
        deprecatedDirectives,
    });
}
exports.augmentWhereInputTypeWithRelationshipFields = augmentWhereInputTypeWithRelationshipFields;
function augmentWhereInputTypeWithConnectionFields(relationshipAdapter, deprecatedDirectives) {
    return augmentWhereInputType({
        whereType: relationshipAdapter.operations.connectionWhereInputTypename,
        fieldName: relationshipAdapter.operations.connectionFieldName,
        filters: relationshipAdapter.listFiltersModel?.connectionFilters,
        relationshipAdapter,
        deprecatedDirectives,
    });
}
exports.augmentWhereInputTypeWithConnectionFields = augmentWhereInputTypeWithConnectionFields;
//# sourceMappingURL=augment-where-input.js.map