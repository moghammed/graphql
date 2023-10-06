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
exports.withConnectWhereFieldInputType = exports.makeConnectionWhereInputType = exports.withSourceWhereInputType = exports.withWhereInputType = exports.withUniqueWhereInputType = void 0;
const graphql_1 = require("graphql");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const RelationshipAdapter_1 = require("../../schema-model/relationship/model-adapters/RelationshipAdapter");
const constants_1 = require("../constants");
const get_where_fields_1 = require("../get-where-fields");
const aggregate_types_1 = require("./aggregate-types");
const augment_where_input_1 = require("./augment-where-input");
const implementation_inputs_1 = require("./implementation-inputs");
function withUniqueWhereInputType({ concreteEntityAdapter, composer, }) {
    const uniqueWhereFields = {};
    for (const attribute of concreteEntityAdapter.uniqueFields) {
        uniqueWhereFields[attribute.name] = attribute.getFieldTypeName();
    }
    const uniqueWhereInputType = composer.createInputTC({
        name: concreteEntityAdapter.operations.uniqueWhereInputTypeName,
        fields: uniqueWhereFields,
    });
    return uniqueWhereInputType;
}
exports.withUniqueWhereInputType = withUniqueWhereInputType;
function withWhereInputType({ entityAdapter, userDefinedFieldDirectives, features, composer, }) {
    if (composer.has(entityAdapter.operations.whereInputTypeName)) {
        return composer.getITC(entityAdapter.operations.whereInputTypeName);
    }
    const whereFields = makeWhereFields({ entityAdapter, userDefinedFieldDirectives, features });
    const whereInputType = composer.createInputTC({
        name: entityAdapter.operations.whereInputTypeName,
        fields: whereFields,
    });
    if (entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        whereInputType.addFields({
            OR: whereInputType.NonNull.List,
            AND: whereInputType.NonNull.List,
            NOT: whereInputType,
        });
        if (entityAdapter.isGlobalNode()) {
            whereInputType.addFields({ id: graphql_1.GraphQLID });
        }
    }
    else if (entityAdapter instanceof RelationshipAdapter_1.RelationshipAdapter) {
        whereInputType.addFields({
            OR: whereInputType.NonNull.List,
            AND: whereInputType.NonNull.List,
            NOT: whereInputType,
        });
    }
    else if (entityAdapter instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        const implementationsWhereInputType = (0, implementation_inputs_1.makeImplementationsWhereInput)({
            interfaceEntityAdapter: entityAdapter,
            composer,
        });
        whereInputType.addFields({ _on: implementationsWhereInputType });
    }
    return whereInputType;
}
exports.withWhereInputType = withWhereInputType;
function makeWhereFields({ entityAdapter, userDefinedFieldDirectives, features, }) {
    if (entityAdapter instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        const fields = {};
        for (const concreteEntity of entityAdapter.concreteEntities) {
            fields[concreteEntity.name] = concreteEntity.operations.whereInputTypeName;
        }
        return fields;
    }
    return (0, get_where_fields_1.getWhereFieldsForAttributes)({
        attributes: entityAdapter.whereFields,
        userDefinedFieldDirectives,
        features,
    });
}
function withSourceWhereInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const relationshipTarget = relationshipAdapter.target;
    if (!(relationshipTarget instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter)) {
        throw new Error("Expected concrete target");
    }
    const relationshipSource = relationshipAdapter.source;
    if (relationshipSource instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const whereInput = composer.getITC(relationshipSource.operations.whereInputTypeName);
    const fields = (0, augment_where_input_1.augmentWhereInputTypeWithRelationshipFields)(relationshipAdapter, deprecatedDirectives);
    whereInput.addFields(fields);
    const whereAggregateInput = (0, aggregate_types_1.withAggregateInputType)({
        relationshipAdapter,
        entityAdapter: relationshipTarget,
        composer: composer,
    });
    if (relationshipAdapter.isFilterableByAggregate()) {
        whereInput.addFields({
            [relationshipAdapter.operations.aggregateTypeName]: {
                type: whereAggregateInput,
                directives: deprecatedDirectives,
            },
        });
    }
    return whereInput;
}
exports.withSourceWhereInputType = withSourceWhereInputType;
// TODO: make another one of these for non-union ConnectionWhereInputType
function makeConnectionWhereInputType({ relationshipAdapter, memberEntity, composer, }) {
    const typeName = relationshipAdapter.operations.getConnectionWhereTypename(memberEntity);
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const connectionWhereInputType = composer.createInputTC({
        name: typeName,
        fields: {
            node: memberEntity.operations.whereInputTypeName,
            node_NOT: {
                type: memberEntity.operations.whereInputTypeName,
                directives: [constants_1.DEPRECATE_NOT],
            },
        },
    });
    connectionWhereInputType.addFields({
        AND: connectionWhereInputType.NonNull.List,
        OR: connectionWhereInputType.NonNull.List,
        NOT: connectionWhereInputType,
    });
    if (relationshipAdapter.propertiesTypeName) {
        connectionWhereInputType.addFields({
            edge: relationshipAdapter.operations.whereInputTypeName,
            edge_NOT: {
                type: relationshipAdapter.operations.whereInputTypeName,
                directives: [constants_1.DEPRECATE_NOT],
            },
        });
    }
    return connectionWhereInputType;
}
exports.makeConnectionWhereInputType = makeConnectionWhereInputType;
function withConnectWhereFieldInputType(relationshipTarget, composer) {
    const connectWhereName = relationshipTarget.operations.connectWhereInputTypeName;
    if (composer.has(connectWhereName)) {
        return composer.getITC(connectWhereName);
    }
    const connectWhereType = composer.createInputTC({
        name: connectWhereName,
        fields: { node: `${relationshipTarget.operations.whereInputTypeName}!` },
    });
    return connectWhereType;
}
exports.withConnectWhereFieldInputType = withConnectWhereFieldInputType;
//# sourceMappingURL=where-input.js.map