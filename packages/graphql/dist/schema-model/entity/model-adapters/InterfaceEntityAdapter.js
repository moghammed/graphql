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
exports.InterfaceEntityAdapter = void 0;
const upper_first_1 = require("../../../utils/upper-first");
const AttributeAdapter_1 = require("../../attribute/model-adapters/AttributeAdapter");
const RelationshipAdapter_1 = require("../../relationship/model-adapters/RelationshipAdapter");
const get_from_map_1 = require("../../utils/get-from-map");
const string_manipulation_1 = require("../../utils/string-manipulation");
const ConcreteEntityAdapter_1 = require("./ConcreteEntityAdapter");
const InterfaceEntityOperations_1 = require("./InterfaceEntityOperations");
class InterfaceEntityAdapter {
    constructor(entity) {
        this.attributes = new Map();
        this.relationships = new Map();
        this.uniqueFieldsKeys = [];
        this.name = entity.name;
        this.concreteEntities = [];
        this.annotations = entity.annotations;
        this.initAttributes(entity.attributes);
        this.initRelationships(entity.relationships);
        this.initConcreteEntities(entity.concreteEntities);
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    get globalIdField() {
        return undefined;
    }
    initConcreteEntities(entities) {
        for (const entity of entities) {
            const entityAdapter = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(entity);
            this.concreteEntities.push(entityAdapter);
        }
    }
    initAttributes(attributes) {
        for (const [attributeName, attribute] of attributes.entries()) {
            const attributeAdapter = new AttributeAdapter_1.AttributeAdapter(attribute);
            this.attributes.set(attributeName, attributeAdapter);
            if (attributeAdapter.isConstrainable() && attributeAdapter.isUnique()) {
                this.uniqueFieldsKeys.push(attribute.name);
            }
        }
    }
    initRelationships(relationships) {
        for (const [relationshipName, relationship] of relationships.entries()) {
            this.relationships.set(relationshipName, new RelationshipAdapter_1.RelationshipAdapter(relationship, this));
        }
    }
    get operations() {
        if (!this._operations) {
            return new InterfaceEntityOperations_1.InterfaceEntityOperations(this);
        }
        return this._operations;
    }
    get singular() {
        if (!this._singular) {
            this._singular = (0, string_manipulation_1.singular)(this.name);
        }
        return this._singular;
    }
    get plural() {
        if (!this._plural) {
            if (this.annotations.plural) {
                this._plural = (0, string_manipulation_1.plural)(this.annotations.plural.value);
            }
            else {
                this._plural = (0, string_manipulation_1.plural)(this.name);
            }
        }
        return this._plural;
    }
    get upperFirstPlural() {
        return (0, upper_first_1.upperFirst)(this.plural);
    }
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get uniqueFields() {
        return this.uniqueFieldsKeys.map((key) => (0, get_from_map_1.getFromMap)(this.attributes, key));
    }
    get sortableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSortableField());
    }
    get whereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isWhereField());
    }
    get updateInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isUpdateInputField());
    }
    get subscriptionEventPayloadFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isEventPayloadField());
    }
    get subscriptionWhereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSubscriptionWhereField());
    }
}
exports.InterfaceEntityAdapter = InterfaceEntityAdapter;
//# sourceMappingURL=InterfaceEntityAdapter.js.map