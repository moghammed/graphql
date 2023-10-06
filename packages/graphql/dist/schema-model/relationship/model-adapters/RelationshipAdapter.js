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
exports.RelationshipAdapter = void 0;
const AttributeAdapter_1 = require("../../attribute/model-adapters/AttributeAdapter");
const ConcreteEntity_1 = require("../../entity/ConcreteEntity");
const InterfaceEntity_1 = require("../../entity/InterfaceEntity");
const UnionEntity_1 = require("../../entity/UnionEntity");
const ConcreteEntityAdapter_1 = require("../../entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../entity/model-adapters/UnionEntityAdapter");
const RelationshipOperations_1 = require("./RelationshipOperations");
const string_manipulation_1 = require("../../utils/string-manipulation");
const constants_1 = require("../../../constants");
const ListFiltersAdapter_1 = require("../../attribute/model-adapters/ListFiltersAdapter");
class RelationshipAdapter {
    constructor(relationship, sourceAdapter) {
        this.attributes = new Map();
        const { name, type, args, attributes = new Map(), source, target, direction, isList, queryDirection, nestedOperations, aggregate, isNullable, description, annotations, propertiesTypeName, inheritedFrom, } = relationship;
        this.name = name;
        this.type = type;
        this.args = args;
        if (sourceAdapter) {
            this.source = sourceAdapter;
        }
        else {
            if (source instanceof ConcreteEntity_1.ConcreteEntity) {
                this.source = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(source);
            }
            else if (source instanceof InterfaceEntity_1.InterfaceEntity) {
                this.source = new InterfaceEntityAdapter_1.InterfaceEntityAdapter(source);
            }
            else if (source instanceof UnionEntity_1.UnionEntity) {
                this.source = new UnionEntityAdapter_1.UnionEntityAdapter(source);
            }
            else {
                throw new Error("relationship source must be an Entity");
            }
        }
        this.direction = direction;
        this.isList = isList;
        this.queryDirection = queryDirection;
        this.nestedOperations = new Set(nestedOperations);
        this.aggregate = aggregate;
        this.isNullable = isNullable;
        this.rawEntity = target;
        this.initAttributes(attributes);
        this.description = description;
        this.annotations = annotations;
        this.propertiesTypeName = propertiesTypeName;
        this.inheritedFrom = inheritedFrom;
    }
    get operations() {
        if (!this._operations) {
            return new RelationshipOperations_1.RelationshipOperations(this);
        }
        return this._operations;
    }
    get listFiltersModel() {
        if (!this._listFiltersModel) {
            if (!this.isList) {
                return;
            }
            this._listFiltersModel = new ListFiltersAdapter_1.ListFiltersAdapter(this);
        }
        return this._listFiltersModel;
    }
    get singular() {
        if (!this._singular) {
            this._singular = (0, string_manipulation_1.singular)(this.name);
        }
        return this._singular;
    }
    get plural() {
        if (!this._plural) {
            this._plural = (0, string_manipulation_1.plural)(this.name);
        }
        return this._plural;
    }
    initAttributes(attributes) {
        for (const [attributeName, attribute] of attributes.entries()) {
            const attributeAdapter = new AttributeAdapter_1.AttributeAdapter(attribute);
            this.attributes.set(attributeName, attributeAdapter);
        }
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    /**
     * translation-only
     *
     * @param directed the direction asked during the query, for instance "friends(directed: true)"
     * @returns the direction to use in the CypherBuilder
     **/
    getCypherDirection(directed) {
        switch (this.queryDirection) {
            case "DIRECTED_ONLY": {
                return this.cypherDirectionFromRelDirection();
            }
            case "UNDIRECTED_ONLY": {
                return "undirected";
            }
            case "DEFAULT_DIRECTED": {
                if (directed === false) {
                    return "undirected";
                }
                return this.cypherDirectionFromRelDirection();
            }
            case "DEFAULT_UNDIRECTED": {
                if (directed === true) {
                    return this.cypherDirectionFromRelDirection();
                }
                return "undirected";
            }
        }
    }
    cypherDirectionFromRelDirection() {
        return this.direction === "IN" ? "left" : "right";
    }
    // construct the target entity only when requested
    get target() {
        if (!this._target) {
            if (this.rawEntity instanceof ConcreteEntity_1.ConcreteEntity) {
                this._target = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(this.rawEntity);
            }
            else if (this.rawEntity instanceof InterfaceEntity_1.InterfaceEntity) {
                this._target = new InterfaceEntityAdapter_1.InterfaceEntityAdapter(this.rawEntity);
            }
            else if (this.rawEntity instanceof UnionEntity_1.UnionEntity) {
                this._target = new UnionEntityAdapter_1.UnionEntityAdapter(this.rawEntity);
            }
            else {
                throw new Error("invalid target entity type");
            }
        }
        return this._target;
    }
    isReadable() {
        return this.annotations.selectable?.onRead !== false;
    }
    isFilterableByValue() {
        return this.annotations.filterable?.byValue !== false;
    }
    isFilterableByAggregate() {
        return this.annotations.filterable?.byAggregate !== false;
    }
    isAggregable() {
        return this.annotations.selectable?.onAggregate !== false;
    }
    isCreatable() {
        return this.annotations.settable?.onCreate !== false;
    }
    isUpdatable() {
        return this.annotations.settable?.onUpdate !== false;
    }
    shouldGenerateFieldInputType(ifUnionRelationshipTargetEntity) {
        let relationshipTarget = this.target;
        if (ifUnionRelationshipTargetEntity) {
            relationshipTarget = ifUnionRelationshipTargetEntity;
        }
        return (this.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CONNECT) ||
            this.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CREATE) ||
            // The connectOrCreate field is not generated if the related type does not have a unique field
            (this.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CONNECT_OR_CREATE) &&
                relationshipTarget instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter &&
                relationshipTarget.uniqueFields.length > 0));
    }
    shouldGenerateUpdateFieldInputType(ifUnionRelationshipTargetEntity) {
        const onlyConnectOrCreate = this.nestedOperations.size === 1 &&
            this.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CONNECT_OR_CREATE);
        if (this.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
            return this.nestedOperations.size > 0 && !onlyConnectOrCreate;
        }
        if (this.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
            if (!ifUnionRelationshipTargetEntity) {
                throw new Error("Expected member entity");
            }
            const onlyConnectOrCreateAndNoUniqueFields = onlyConnectOrCreate && !ifUnionRelationshipTargetEntity.uniqueFields.length;
            return this.nestedOperations.size > 0 && !onlyConnectOrCreateAndNoUniqueFields;
        }
        const onlyConnectOrCreateAndNoUniqueFields = onlyConnectOrCreate && !this.target.uniqueFields.length;
        return this.nestedOperations.size > 0 && !onlyConnectOrCreateAndNoUniqueFields;
    }
    get nonGeneratedProperties() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isNonGeneratedField());
    }
    get hasNonNullNonGeneratedProperties() {
        return this.nonGeneratedProperties.some((property) => property.typeHelper.isRequired());
    }
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get aggregableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isAggregableField());
    }
    get aggregationWhereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isAggregationWhereField());
    }
    get createInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isCreateInputField());
    }
    get updateInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isUpdateInputField());
    }
    get sortableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSortableField());
    }
    get whereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isWhereField());
    }
    get subscriptionWhereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSubscriptionWhereField());
    }
    get subscriptionConnectedRelationshipFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSubscriptionConnectedRelationshipField());
    }
}
exports.RelationshipAdapter = RelationshipAdapter;
//# sourceMappingURL=RelationshipAdapter.js.map