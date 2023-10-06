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
exports.FieldFactory = void 0;
const utils_1 = require("@graphql-tools/utils");
const ConcreteEntityAdapter_1 = require("../../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const RelationshipAdapter_1 = require("../../../schema-model/relationship/model-adapters/RelationshipAdapter");
const utils_2 = require("../../../utils/utils");
const check_authentication_1 = require("../../authorization/check-authentication");
const OperationField_1 = require("../ast/fields/OperationField");
const AggregationAttributeField_1 = require("../ast/fields/aggregation-fields/AggregationAttributeField");
const CountField_1 = require("../ast/fields/aggregation-fields/CountField");
const AttributeField_1 = require("../ast/fields/attribute-fields/AttributeField");
const CypherAttributeField_1 = require("../ast/fields/attribute-fields/CypherAttributeField");
const CypherUnionAttributeField_1 = require("../ast/fields/attribute-fields/CypherUnionAttributeField");
const CypherUnionAttributePartial_1 = require("../ast/fields/attribute-fields/CypherUnionAttributePartial");
const DateTimeField_1 = require("../ast/fields/attribute-fields/DateTimeField");
const PointAttributeField_1 = require("../ast/fields/attribute-fields/PointAttributeField");
const is_concrete_entity_1 = require("../utils/is-concrete-entity");
const parse_selection_set_fields_1 = require("./parsers/parse-selection-set-fields");
class FieldFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createFields(entity, rawFields, context) {
        const fieldsToMerge = (0, utils_2.filterTruthy)(Object.values(rawFields).map((field) => {
            const { fieldName } = (0, parse_selection_set_fields_1.parseSelectionSetField)(field.name);
            return this.getRequiredResolveTree({
                entity,
                fieldName,
            });
        }));
        const mergedFields = (0, utils_1.mergeDeep)([rawFields, ...fieldsToMerge]);
        const fields = Object.values(mergedFields).flatMap((field) => {
            if ((0, is_concrete_entity_1.isConcreteEntity)(entity)) {
                // TODO: Move this to the tree
                (0, check_authentication_1.checkEntityAuthentication)({
                    entity: entity.entity,
                    targetOperations: ["READ"],
                    context,
                    field: field.name,
                });
            }
            const { fieldName, isConnection, isAggregation } = (0, parse_selection_set_fields_1.parseSelectionSetField)(field.name);
            if (isConnection) {
                if (entity instanceof RelationshipAdapter_1.RelationshipAdapter)
                    throw new Error("Cannot create connection field of relationship");
                return this.createConnectionField(entity, fieldName, field, context);
            }
            if (isAggregation) {
                if (entity instanceof RelationshipAdapter_1.RelationshipAdapter)
                    throw new Error("Cannot create aggregation field of relationship");
                const relationship = entity.findRelationship(fieldName);
                if (!relationship)
                    throw new Error("Relationship for aggregation not found");
                return this.createRelationshipAggregationField(relationship, fieldName, field, context);
            }
            if ((0, is_concrete_entity_1.isConcreteEntity)(entity)) {
                const relationship = entity.findRelationship(fieldName);
                if (relationship) {
                    return this.createRelationshipField({ relationship, field, context });
                }
            }
            return this.createAttributeField({
                entity,
                fieldName,
                field,
                context,
            });
        });
        return (0, utils_2.filterTruthy)(fields);
    }
    createRelationshipAggregationField(relationship, fieldName, resolveTree, context) {
        const operation = this.queryASTFactory.operationsFactory.createAggregationOperation(relationship, resolveTree, context);
        return new OperationField_1.OperationField({
            alias: resolveTree.alias,
            operation,
        });
    }
    createAggregationFields(entity, rawFields) {
        return (0, utils_2.filterTruthy)(Object.values(rawFields).map((field) => {
            if (field.name === "count") {
                return new CountField_1.CountField({
                    alias: field.alias,
                    entity: entity,
                });
            }
            else {
                const attribute = entity.findAttribute(field.name);
                if (!attribute)
                    throw new Error(`Attribute ${field.name} not found`);
                return new AggregationAttributeField_1.AggregationAttributeField({
                    attribute,
                    alias: field.alias,
                });
            }
        }));
    }
    getRequiredResolveTree({ entity, fieldName, }) {
        const attribute = entity.findAttribute(fieldName);
        if (!attribute)
            return undefined;
        const customResolver = attribute.annotations.customResolver;
        if (!customResolver) {
            return undefined;
        }
        return customResolver.parsedRequires;
    }
    createAttributeField({ entity, fieldName, field, context, }) {
        if (["cursor", "node"].includes(fieldName))
            return;
        let attribute = entity.findAttribute(fieldName);
        if (fieldName === "id" && !attribute && (0, is_concrete_entity_1.isConcreteEntity)(entity)) {
            attribute = entity.globalIdField;
            if (!attribute)
                throw new Error(`attribute ${fieldName} not found`);
            // NOTE: for some reason, the alias needs to be the same as the database name
            return new AttributeField_1.AttributeField({ alias: attribute.databaseName, attribute });
        }
        if (!attribute)
            throw new Error(`attribute ${fieldName} not found`);
        if (attribute.annotations.cypher) {
            return this.createCypherAttributeField({
                field,
                attribute,
                context,
            });
        }
        if (attribute.typeHelper.isPoint() || attribute.typeHelper.isCartesianPoint()) {
            const typeName = attribute.typeHelper.isList()
                ? attribute.type.ofType.name
                : attribute.type.name;
            const { crs } = field.fieldsByTypeName[typeName];
            return new PointAttributeField_1.PointAttributeField({
                attribute,
                alias: field.alias,
                crs: Boolean(crs),
            });
        }
        if (attribute.typeHelper.isDateTime()) {
            return new DateTimeField_1.DateTimeField({
                attribute,
                alias: field.alias,
            });
        }
        return new AttributeField_1.AttributeField({ alias: field.alias, attribute });
    }
    createCypherAttributeField({ field, attribute, context, }) {
        const cypherAnnotation = attribute.annotations.cypher;
        if (!cypherAnnotation)
            throw new Error("@Cypher directive missing");
        const typeName = attribute.typeHelper.isList() ? attribute.type.ofType.name : attribute.type.name;
        const rawFields = field.fieldsByTypeName[typeName];
        let cypherProjection;
        let nestedFields;
        const extraParams = {};
        if (cypherAnnotation.statement.includes("$jwt") && context.authorization.jwtParam) {
            extraParams.jwt = context.authorization.jwtParam.value;
        }
        if (rawFields) {
            cypherProjection = Object.values(rawFields).reduce((acc, f) => {
                acc[f.alias] = f.name;
                return acc;
            }, {});
            // if the attribute is an object or an abstract type we may have nested fields
            if (attribute.typeHelper.isAbstract() || attribute.typeHelper.isObject()) {
                // TODO: this code block could be handled directly in the schema model or in some schema model helper
                const targetEntity = this.queryASTFactory.schemaModel.getEntity(typeName);
                // Raise an error as we expect that any complex attributes type are always entities
                if (!targetEntity)
                    throw new Error(`Entity ${typeName} not found`);
                if (targetEntity.isConcreteEntity()) {
                    const concreteEntityAdapter = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(targetEntity);
                    nestedFields = this.createFields(concreteEntityAdapter, rawFields, context);
                }
                else if (targetEntity.isCompositeEntity()) {
                    const concreteEntities = targetEntity.concreteEntities.map((e) => new ConcreteEntityAdapter_1.ConcreteEntityAdapter(e));
                    const nestedUnionFields = concreteEntities.flatMap((concreteEntity) => {
                        const concreteEntityFields = field.fieldsByTypeName[concreteEntity.name];
                        const unionNestedFields = this.createFields(concreteEntity, { ...rawFields, ...concreteEntityFields }, context);
                        return [
                            new CypherUnionAttributePartial_1.CypherUnionAttributePartial({
                                fields: unionNestedFields,
                                target: concreteEntity,
                            }),
                        ];
                    });
                    return new CypherUnionAttributeField_1.CypherUnionAttributeField({
                        attribute,
                        alias: field.alias,
                        projection: cypherProjection,
                        rawArguments: field.args,
                        unionPartials: nestedUnionFields,
                        extraParams,
                    });
                }
            }
        }
        return new CypherAttributeField_1.CypherAttributeField({
            attribute,
            alias: field.alias,
            projection: cypherProjection,
            nestedFields,
            rawArguments: field.args,
            extraParams,
        });
    }
    createConnectionField(entity, fieldName, field, context) {
        const relationship = entity.findRelationship(fieldName);
        if (!relationship)
            throw new Error(`Relationship  ${fieldName} not found in entity ${entity.name}`);
        const connectionOp = this.queryASTFactory.operationsFactory.createConnectionOperationAST(relationship, field, context);
        return new OperationField_1.OperationField({
            operation: connectionOp,
            alias: field.alias,
        });
    }
    createRelationshipField({ relationship, field, context, }) {
        const operation = this.queryASTFactory.operationsFactory.createReadOperation(relationship, field, context);
        return new OperationField_1.OperationField({
            operation,
            alias: field.alias,
        });
    }
}
exports.FieldFactory = FieldFactory;
//# sourceMappingURL=FieldFactory.js.map