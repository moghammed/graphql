"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSortInputType = exports.withOptionsInputType = void 0;
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
const graphql_1 = require("graphql");
const constants_1 = require("../../constants");
const SortDirection_1 = require("../../graphql/enums/SortDirection");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const RelationshipAdapter_1 = require("../../schema-model/relationship/model-adapters/RelationshipAdapter");
const to_compose_1 = require("../to-compose");
function withOptionsInputType({ entityAdapter, userDefinedFieldDirectives, composer, }) {
    const optionsInputType = makeOptionsInput({ entityAdapter, composer });
    if (!entityAdapter.sortableFields.length) {
        return optionsInputType;
    }
    const sortInput = makeSortInput({ entityAdapter, userDefinedFieldDirectives, composer });
    // TODO: Concrete vs Abstract discrepancy
    // is this intended? For ConcreteEntity is NonNull, for InterfaceEntity is nullable
    const sortFieldType = entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter ? sortInput.NonNull.List : sortInput.List;
    optionsInputType.addFields({
        sort: {
            description: `Specify one or more ${entityAdapter.operations.sortInputTypeName} objects to sort ${entityAdapter.upperFirstPlural} by. The sorts will be applied in the order in which they are arranged in the array.`,
            type: sortFieldType,
        },
    });
    return optionsInputType;
}
exports.withOptionsInputType = withOptionsInputType;
function withSortInputType({ relationshipAdapter, userDefinedFieldDirectives, composer, }) {
    // TODO: Use the commented code when we want to unify the sort input type for relationships and entities
    // if (!relationshipAdapter.sortableFields.length) {
    //     return undefined;
    // }
    // return makeSortInput({ entityAdapter: relationshipAdapter, userDefinedFieldDirectives, composer });
    const sortFields = {};
    for (const attribute of relationshipAdapter.attributes.values()) {
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(attribute.name) || [];
        const deprecatedDirective = userDefinedDirectivesOnField.filter((directive) => directive.name.value === constants_1.DEPRECATED);
        sortFields[attribute.name] = {
            type: SortDirection_1.SortDirection,
            directives: (0, to_compose_1.graphqlDirectivesToCompose)(deprecatedDirective),
        };
    }
    const sortInput = composer.createInputTC({
        name: relationshipAdapter.operations.sortInputTypeName,
        fields: sortFields,
    });
    return sortInput;
}
exports.withSortInputType = withSortInputType;
function makeSortFields({ entityAdapter, userDefinedFieldDirectives, }) {
    const sortFields = {};
    const sortableAttributes = entityAdapter.sortableFields;
    for (const attribute of sortableAttributes) {
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(attribute.name) || [];
        const deprecatedDirective = userDefinedDirectivesOnField.filter((directive) => directive.name.value === constants_1.DEPRECATED);
        sortFields[attribute.name] = {
            type: SortDirection_1.SortDirection,
            directives: (0, to_compose_1.graphqlDirectivesToCompose)(deprecatedDirective),
        };
    }
    return sortFields;
}
function makeSortInput({ entityAdapter, userDefinedFieldDirectives, composer, }) {
    const sortFields = makeSortFields({ entityAdapter, userDefinedFieldDirectives });
    const sortInput = composer.createInputTC({
        name: entityAdapter.operations.sortInputTypeName,
        fields: sortFields,
    });
    if (!(entityAdapter instanceof RelationshipAdapter_1.RelationshipAdapter)) {
        sortInput.setDescription(`Fields to sort ${entityAdapter.upperFirstPlural} by. The order in which sorts are applied is not guaranteed when specifying many fields in one ${entityAdapter.operations.sortInputTypeName} object.`);
    }
    return sortInput;
}
function makeOptionsInput({ entityAdapter, composer, }) {
    const optionsInput = composer.createInputTC({
        name: entityAdapter.operations.optionsInputTypeName,
        fields: { limit: graphql_1.GraphQLInt, offset: graphql_1.GraphQLInt },
    });
    return optionsInput;
}
//# sourceMappingURL=sort-and-options-input.js.map