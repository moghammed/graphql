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
exports.FilterFactory = void 0;
const RelationshipAdapter_1 = require("../../../schema-model/relationship/model-adapters/RelationshipAdapter");
const global_ids_1 = require("../../../utils/global-ids");
const utils_1 = require("../../../utils/utils");
const logical_operators_1 = require("../../utils/logical-operators");
const ConnectionFilter_1 = require("../ast/filters/ConnectionFilter");
const Filter_1 = require("../ast/filters/Filter");
const LogicalFilter_1 = require("../ast/filters/LogicalFilter");
const RelationshipFilter_1 = require("../ast/filters/RelationshipFilter");
const AggregationDurationPropertyFilter_1 = require("../ast/filters/aggregation/AggregationDurationPropertyFilter");
const AggregationFilter_1 = require("../ast/filters/aggregation/AggregationFilter");
const AggregationPropertyFilter_1 = require("../ast/filters/aggregation/AggregationPropertyFilter");
const CountFilter_1 = require("../ast/filters/aggregation/CountFilter");
const DurationFilter_1 = require("../ast/filters/property-filters/DurationFilter");
const PointFilter_1 = require("../ast/filters/property-filters/PointFilter");
const PropertyFilter_1 = require("../ast/filters/property-filters/PropertyFilter");
const get_concrete_entities_1 = require("../utils/get-concrete-entities");
const is_concrete_entity_1 = require("../utils/is-concrete-entity");
const is_interface_entity_1 = require("../utils/is-interface-entity");
const is_union_entity_1 = require("../utils/is-union-entity");
const parse_where_field_1 = require("./parsers/parse-where-field");
class FilterFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    /**
     * Get all the entities explicitly required by the where "on" object. If it's a concrete entity it will return itself.
     **/
    filterConcreteEntities(entity, where) {
        if ((0, is_concrete_entity_1.isConcreteEntity)(entity)) {
            return [entity];
        }
        const nodeOnWhere = (0, is_interface_entity_1.isInterfaceEntity)(entity) ? where.node?._on ?? {} : where;
        return entity.concreteEntities.filter((ce) => Object.keys(nodeOnWhere).some((key) => key === ce.name));
    }
    createConnectionFilter(relationship, where, filterOps) {
        if ((0, is_interface_entity_1.isInterfaceEntity)(relationship.target) && !where.node?._on) {
            // Optimization for interface entities, create a single connection filter for all the concrete entities, when no _on is specified.
            const connectionFilter = new ConnectionFilter_1.ConnectionFilter({
                relationship: relationship,
                target: relationship.target,
                isNot: filterOps.isNot,
                operator: filterOps.operator,
            });
            const filters = this.createConnectionPredicates(relationship, relationship.target, where);
            connectionFilter.addFilters(filters);
            return [connectionFilter];
        }
        else {
            const filteredEntities = this.filterConcreteEntities(relationship.target, where);
            const connectionFilters = [];
            for (const concreteEntity of filteredEntities) {
                const connectionFilter = new ConnectionFilter_1.ConnectionFilter({
                    relationship: relationship,
                    target: concreteEntity,
                    isNot: filterOps.isNot,
                    operator: filterOps.operator,
                });
                const filters = this.createConnectionPredicates(relationship, concreteEntity, where);
                connectionFilter.addFilters(filters);
                connectionFilters.push(connectionFilter);
            }
            return connectionFilters;
        }
    }
    createConnectionPredicates(rel, entity, where) {
        let entityWhere = where;
        if ((0, is_union_entity_1.isUnionEntity)(rel.target) && where[entity.name]) {
            entityWhere = where[entity.name];
        }
        const filters = (0, utils_1.asArray)(entityWhere).flatMap((nestedWhere) => {
            return Object.entries(nestedWhere).flatMap(([key, value]) => {
                if ((0, logical_operators_1.isLogicalOperator)(key)) {
                    const nestedFilters = this.createConnectionPredicates(rel, entity, value);
                    return [
                        new LogicalFilter_1.LogicalFilter({
                            operation: key,
                            filters: (0, utils_1.filterTruthy)(nestedFilters),
                        }),
                    ];
                }
                const connectionWhereField = (0, parse_where_field_1.parseConnectionWhereFields)(key);
                if (connectionWhereField.fieldName === "edge") {
                    return this.createEdgeFilters(rel, value);
                }
                if (connectionWhereField.fieldName === "node") {
                    return this.createNodeFilters(entity, value);
                }
            });
        });
        return (0, utils_1.filterTruthy)(filters);
    }
    createPropertyFilter({ attribute, comparisonValue, operator, isNot, attachedTo, }) {
        const filterOperator = operator || "EQ";
        if (attribute.typeHelper.isDuration()) {
            return new DurationFilter_1.DurationFilter({
                attribute,
                comparisonValue,
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
        if (attribute.typeHelper.isPoint() || attribute.typeHelper.isCartesianPoint()) {
            return new PointFilter_1.PointFilter({
                attribute,
                comparisonValue,
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
        return new PropertyFilter_1.PropertyFilter({
            attribute,
            comparisonValue,
            isNot,
            operator: filterOperator,
            attachedTo,
        });
    }
    createRelationshipFilter(where, relationship, filterOps) {
        /**
         * The logic below can be confusing, but it's to handle the following cases:
         * 1. where: { actors: null } -> in this case we want to return an Exists filter as showed by tests packages/graphql/tests/tck/null.test.ts
         * 2. where: {} -> in this case we want to not apply any filter, as showed by tests packages/graphql/tests/tck/issues/402.test.ts
         **/
        const isNull = where === null;
        if (!isNull && Object.keys(where).length === 0) {
            return;
        }
        // this is because if isNull it's true we want to wrap the Exist subclause in a NOT, but if it's isNull it's true and isNot it's true they negate each other
        const isNot = isNull ? !filterOps.isNot : filterOps.isNot;
        const relationshipFilter = this.createRelationshipFilterTreeNode({
            relationship: relationship,
            isNot,
            operator: filterOps.operator || "SOME",
        });
        if (!isNull) {
            const targetNode = relationship.target;
            const targetNodeFilters = this.createNodeFilters(targetNode, where);
            relationshipFilter.addTargetNodeFilter(...targetNodeFilters);
        }
        return relationshipFilter;
    }
    // This allow to override this creation in AuthorizationFilterFactory
    createRelationshipFilterTreeNode(options) {
        return new RelationshipFilter_1.RelationshipFilter(options);
    }
    getConcretePredicate(entity, where) {
        const concreteEntities = (0, get_concrete_entities_1.getConcreteEntities)(entity);
        const nodeFilters = [];
        for (const concreteEntity of concreteEntities) {
            const concreteEntityWhere = where[concreteEntity.name];
            if (!concreteEntityWhere)
                continue;
            const concreteEntityFilters = this.createNodeFilters(concreteEntity, concreteEntityWhere);
            nodeFilters.push(...concreteEntityFilters);
        }
        return this.wrapMultipleFiltersInLogical(nodeFilters)[0];
    }
    // TODO: rename and refactor this, createNodeFilters is misleading for non-connection operations
    createNodeFilters(entity, where) {
        const filters = (0, utils_1.filterTruthy)(Object.entries(where).flatMap(([key, value]) => {
            if (key === "_on" && (0, utils_1.isObject)(value)) {
                return this.getConcretePredicate(entity, value);
            }
            if ((0, logical_operators_1.isLogicalOperator)(key)) {
                return this.createNodeLogicalFilter(key, value, entity);
            }
            const { fieldName, operator, isNot, isConnection, isAggregate } = (0, parse_where_field_1.parseWhereField)(key);
            let relationship;
            if ((0, is_concrete_entity_1.isConcreteEntity)(entity)) {
                relationship = entity.findRelationship(fieldName);
            }
            if (isConnection) {
                if (!relationship)
                    throw new Error(`Relationship not found for connection ${fieldName}`);
                if (operator && !(0, Filter_1.isRelationshipOperator)(operator)) {
                    throw new Error(`Invalid operator ${operator} for relationship`);
                }
                const connectionFilters = this.createConnectionFilter(relationship, value, {
                    isNot,
                    operator,
                });
                return this.wrapMultipleFiltersInLogical(connectionFilters)[0];
            }
            if (isAggregate) {
                if (!relationship)
                    throw new Error(`Relationship not found for connection ${fieldName}`);
                return this.createAggregationFilter(value, relationship);
            }
            if (relationship) {
                if (operator && !(0, Filter_1.isRelationshipOperator)(operator)) {
                    throw new Error(`Invalid operator ${operator} for relationship`);
                }
                return this.createRelationshipFilter(value, relationship, {
                    isNot,
                    operator,
                });
            }
            const attr = !(0, is_union_entity_1.isUnionEntity)(entity) ? entity.findAttribute(fieldName) : undefined;
            if (fieldName === "id" && !attr && !(0, is_union_entity_1.isUnionEntity)(entity)) {
                const relayAttribute = entity.globalIdField;
                //
                if (relayAttribute) {
                    const relayIdData = (0, global_ids_1.fromGlobalId)(value);
                    if (relayIdData) {
                        const { typeName, field } = relayIdData;
                        let id = relayIdData.id;
                        if (typeName !== entity.name || !field || !id) {
                            throw new Error(`Cannot query Relay Id on "${entity.name}"`);
                        }
                        const idAttribute = entity.findAttribute(field);
                        if (!idAttribute)
                            throw new Error(`Attribute ${field} not found`);
                        if (idAttribute.typeHelper.isNumeric()) {
                            id = Number(id);
                            if (Number.isNaN(id)) {
                                throw new Error("Can't parse non-numeric relay id");
                            }
                        }
                        return this.createPropertyFilter({
                            attribute: idAttribute,
                            comparisonValue: id,
                            isNot,
                            operator,
                        });
                    }
                }
            }
            if (!attr)
                throw new Error(`Attribute ${fieldName} not found`);
            return this.createPropertyFilter({
                attribute: attr,
                comparisonValue: value,
                isNot,
                operator,
            });
        }));
        return this.wrapMultipleFiltersInLogical(filters);
    }
    createEdgeFilters(relationship, where) {
        const filterASTs = Object.entries(where).map(([key, value]) => {
            if ((0, logical_operators_1.isLogicalOperator)(key)) {
                return this.createEdgeLogicalFilter(key, value, relationship);
            }
            const { fieldName, operator, isNot } = (0, parse_where_field_1.parseWhereField)(key);
            const attribute = relationship.findAttribute(fieldName);
            if (!attribute)
                throw new Error(`no filter attribute ${key}`);
            return this.createPropertyFilter({
                attribute,
                comparisonValue: value,
                isNot,
                operator,
                attachedTo: "relationship",
            });
        });
        return this.wrapMultipleFiltersInLogical((0, utils_1.filterTruthy)(filterASTs));
    }
    createNodeLogicalFilter(operation, where, entity) {
        const nestedFilters = (0, utils_1.asArray)(where).flatMap((nestedWhere) => {
            return this.createNodeFilters(entity, nestedWhere);
        });
        return new LogicalFilter_1.LogicalFilter({
            operation,
            filters: nestedFilters,
        });
    }
    createEdgeLogicalFilter(operation, where, relationship) {
        const nestedFilters = (0, utils_1.asArray)(where).flatMap((nestedWhere) => {
            return this.createEdgeFilters(relationship, nestedWhere);
        });
        return new LogicalFilter_1.LogicalFilter({
            operation,
            filters: nestedFilters,
        });
    }
    getAggregationNestedFilters(where, relationship) {
        const nestedFilters = Object.entries(where).flatMap(([key, value]) => {
            if ((0, logical_operators_1.isLogicalOperator)(key)) {
                const nestedFilters = (0, utils_1.asArray)(value).flatMap((nestedWhere) => {
                    return this.getAggregationNestedFilters(nestedWhere, relationship);
                });
                const logicalFilter = new LogicalFilter_1.LogicalFilter({
                    operation: key,
                    filters: nestedFilters,
                });
                return [logicalFilter];
            }
            const { fieldName, operator, isNot } = (0, parse_where_field_1.parseWhereField)(key);
            const filterOperator = operator || "EQ";
            if (fieldName === "count") {
                const countFilter = new CountFilter_1.CountFilter({
                    operator: filterOperator,
                    isNot,
                    comparisonValue: value,
                });
                return [countFilter];
            }
            if (fieldName === "node") {
                return this.createAggregationNodeFilters(value, relationship.target);
            }
            if (fieldName === "edge") {
                return this.createAggregationNodeFilters(value, relationship);
            }
            throw new Error(`Aggregation filter not found ${key}`);
        });
        return this.wrapMultipleFiltersInLogical(nestedFilters);
    }
    createAggregationFilter(where, relationship) {
        const aggregationFilter = new AggregationFilter_1.AggregationFilter(relationship);
        const nestedFilters = this.getAggregationNestedFilters(where, relationship);
        aggregationFilter.addFilters(...nestedFilters);
        return aggregationFilter;
    }
    createAggregationNodeFilters(where, entity) {
        const filters = Object.entries(where).map(([key, value]) => {
            if ((0, logical_operators_1.isLogicalOperator)(key)) {
                return this.createAggregateLogicalFilter(key, value, entity);
            }
            // NOTE: if aggregationOperator is undefined, maybe we could return a normal PropertyFilter instead
            const { fieldName, logicalOperator, aggregationOperator } = (0, parse_where_field_1.parseAggregationWhereFields)(key);
            const attr = entity.findAttribute(fieldName);
            if (!attr)
                throw new Error(`Attribute ${fieldName} not found`);
            const attachedTo = entity instanceof RelationshipAdapter_1.RelationshipAdapter ? "relationship" : "node";
            if (attr.typeHelper.isDuration()) {
                return new AggregationDurationPropertyFilter_1.AggregationDurationFilter({
                    attribute: attr,
                    comparisonValue: value,
                    logicalOperator: logicalOperator || "EQUAL",
                    aggregationOperator: aggregationOperator,
                    attachedTo,
                });
            }
            return new AggregationPropertyFilter_1.AggregationPropertyFilter({
                attribute: attr,
                comparisonValue: value,
                logicalOperator: logicalOperator || "EQUAL",
                aggregationOperator: aggregationOperator,
                attachedTo,
            });
        });
        return this.wrapMultipleFiltersInLogical(filters);
    }
    wrapMultipleFiltersInLogical(filters, logicalOp = "AND") {
        if (filters.length > 1) {
            return [
                new LogicalFilter_1.LogicalFilter({
                    operation: logicalOp,
                    filters,
                }),
            ];
        }
        return filters;
    }
    createAggregateLogicalFilter(operation, where, entity) {
        const filters = (0, utils_1.asArray)(where).flatMap((nestedWhere) => {
            return this.createAggregationNodeFilters(nestedWhere, entity);
        });
        return new LogicalFilter_1.LogicalFilter({
            operation,
            filters,
        });
    }
}
exports.FilterFactory = FilterFactory;
//# sourceMappingURL=FilterFactory.js.map