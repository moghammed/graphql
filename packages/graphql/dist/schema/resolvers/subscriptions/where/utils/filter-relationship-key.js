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
exports.filterRelationshipKey = void 0;
const InterfaceEntityAdapter_1 = require("../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../../../../schema-model/entity/model-adapters/UnionEntityAdapter");
const filter_by_properties_1 = require("../filters/filter-by-properties");
const type_checks_1 = require("./type-checks");
function filterRelationshipKey({ receivedEventRelationship, where, receivedEvent, }) {
    const receivedEventProperties = receivedEvent.properties;
    const receivedEventRelationshipName = receivedEventRelationship.name;
    const receivedEventRelationshipData = where[receivedEventRelationshipName];
    const isRelationshipOfReceivedTypeFilteredOut = !receivedEventRelationshipData;
    if (isRelationshipOfReceivedTypeFilteredOut) {
        // case `actors: {}` filtering out relationships of other type
        return false;
    }
    const isRelationshipOfReceivedTypeIncludedWithNoFilters = !Object.keys(receivedEventRelationshipData).length;
    if (isRelationshipOfReceivedTypeIncludedWithNoFilters) {
        // case `actors: {}` including all relationships of the type
        return true;
    }
    const { edge: edgeProperty, node: nodeProperty, ...unionTypes } = receivedEventRelationshipData;
    // relationship properties
    if (edgeProperty) {
        // apply the filter
        if (!filterRelationshipEdgeProperty({
            relationshipAdapter: receivedEventRelationship,
            edgeProperty,
            receivedEventProperties,
        })) {
            return false;
        }
    }
    const key = receivedEventRelationship.direction === "IN" ? "from" : "to";
    const isSimpleRelationship = nodeProperty && (0, type_checks_1.isStandardType)(nodeProperty, receivedEventRelationship);
    const isInterfaceRelationship = nodeProperty && (0, type_checks_1.isInterfaceType)(nodeProperty, receivedEventRelationship);
    const isUnionRelationship = Object.keys(unionTypes).length;
    if (isSimpleRelationship) {
        // const nodeTo = nodes.find((n) => n.name === receivedEventRelationship.typeMeta.name) as Node;
        const nodeTo = receivedEventRelationship.target; //TODO: fix ts. Should be concreteEntity since isSimpleRelationship right??
        // apply the filter
        if (!(0, filter_by_properties_1.filterByProperties)({
            attributes: nodeTo.attributes,
            whereProperties: nodeProperty,
            receivedProperties: receivedEventProperties[key],
        })) {
            return false;
        }
    }
    if (isInterfaceRelationship) {
        const targetNodeTypename = receivedEvent[`${key}Typename`];
        // apply the filter
        if (!filterRelationshipInterfaceProperty({
            nodeProperty,
            relationshipAdapter: receivedEventRelationship,
            receivedEventProperties,
            targetNodeTypename,
            key,
        })) {
            return false;
        }
    }
    if (isUnionRelationship) {
        const targetNodeTypename = receivedEvent[`${key}Typename`];
        const targetNodePropsByTypename = unionTypes[targetNodeTypename];
        const isRelationshipOfReceivedTypeFilteredOut = !targetNodePropsByTypename;
        if (isRelationshipOfReceivedTypeFilteredOut) {
            return false;
        }
        // apply the filter
        if (!filterRelationshipUnionProperties({
            targetNodePropsByTypename,
            targetNodeTypename,
            receivedEventProperties,
            relationshipAdapter: receivedEventRelationship,
            key,
        })) {
            return false;
        }
    }
    return true;
}
exports.filterRelationshipKey = filterRelationshipKey;
function filterRelationshipUnionProperties({ targetNodePropsByTypename, targetNodeTypename, receivedEventProperties, relationshipAdapter, key, }) {
    for (const [propertyName, propertyValueAsUnionTypeData] of Object.entries(targetNodePropsByTypename)) {
        if (propertyName === "node") {
            const unionTarget = relationshipAdapter.target;
            if (!(unionTarget instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
                throw new Error(`Expected ${unionTarget.name} to be union`);
            }
            const nodeTo = unionTarget.concreteEntities.find((e) => e.name === targetNodeTypename);
            if (!nodeTo) {
                throw new Error(`${targetNodeTypename} not found as part of union ${unionTarget.name}`);
            }
            if (!(0, filter_by_properties_1.filterByProperties)({
                attributes: nodeTo.attributes,
                whereProperties: propertyValueAsUnionTypeData,
                receivedProperties: receivedEventProperties[key],
            })) {
                return false;
            }
        }
        if (propertyName === "edge" &&
            !filterRelationshipEdgeProperty({
                relationshipAdapter,
                edgeProperty: propertyValueAsUnionTypeData,
                receivedEventProperties,
            })) {
            return false;
        }
    }
    return true;
}
function filterRelationshipInterfaceProperty({ nodeProperty, relationshipAdapter, receivedEventProperties, targetNodeTypename, key, }) {
    const { _on, ...commonFields } = nodeProperty;
    const targetNode = relationshipAdapter.target;
    if (!(targetNode instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter)) {
        throw new Error(`Expected ${targetNode.name} to be interface`);
    }
    const nodeTo = targetNode.concreteEntities.find((e) => e.name === targetNodeTypename);
    if (!nodeTo) {
        throw new Error(`${targetNodeTypename} not found as part of interface ${targetNode.name}`);
    }
    // const targetNode = nodes.find((n) => n.name === targetNodeTypename) as Node;
    if (commonFields && !_on) {
        if (!(0, filter_by_properties_1.filterByProperties)({
            attributes: nodeTo.attributes,
            whereProperties: commonFields,
            receivedProperties: receivedEventProperties[key],
        })) {
            return false;
        }
    }
    if ((0, type_checks_1.isInterfaceSpecificFieldType)(_on)) {
        const isRelationshipOfReceivedTypeFilteredOut = !_on[targetNodeTypename];
        if (isRelationshipOfReceivedTypeFilteredOut) {
            return false;
        }
        const commonFieldsMergedWithSpecificFields = { ...commonFields, ..._on[targetNodeTypename] }; //override common <fields, filter> combination with specific <fields, filter>
        if (!(0, filter_by_properties_1.filterByProperties)({
            attributes: nodeTo.attributes,
            whereProperties: commonFieldsMergedWithSpecificFields,
            receivedProperties: receivedEventProperties[key],
        })) {
            return false;
        }
    }
    return true;
}
function filterRelationshipEdgeProperty({ relationshipAdapter, edgeProperty, receivedEventProperties, }) {
    const noRelationshipPropertiesFound = !relationshipAdapter.attributes.size;
    if (noRelationshipPropertiesFound) {
        return true;
    }
    return (0, filter_by_properties_1.filterByProperties)({
        attributes: relationshipAdapter.attributes,
        whereProperties: edgeProperty,
        receivedProperties: receivedEventProperties.relationship,
    });
}
//# sourceMappingURL=filter-relationship-key.js.map