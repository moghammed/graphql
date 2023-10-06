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
exports.ConcreteEntityOperations = void 0;
const upper_first_1 = require("../../../utils/upper-first");
class ConcreteEntityOperations {
    constructor(concreteEntityAdapter) {
        this.concreteEntityAdapter = concreteEntityAdapter;
        this.pascalCasePlural = (0, upper_first_1.upperFirst)(this.concreteEntityAdapter.plural);
        this.pascalCaseSingular = (0, upper_first_1.upperFirst)(this.concreteEntityAdapter.singular);
    }
    get whereInputTypeName() {
        return `${this.concreteEntityAdapter.name}Where`;
    }
    get uniqueWhereInputTypeName() {
        // ConnectOrCreateWhere.node
        return `${this.concreteEntityAdapter.name}UniqueWhere`;
    }
    get connectOrCreateWhereInputTypeName() {
        return `${this.concreteEntityAdapter.name}ConnectOrCreateWhere`;
    }
    get connectWhereInputTypeName() {
        return `${this.concreteEntityAdapter.name}ConnectWhere`;
    }
    get createInputTypeName() {
        return `${this.concreteEntityAdapter.name}CreateInput`;
    }
    get updateInputTypeName() {
        return `${this.concreteEntityAdapter.name}UpdateInput`;
    }
    get deleteInputTypeName() {
        return `${this.concreteEntityAdapter.name}DeleteInput`;
    }
    get optionsInputTypeName() {
        return `${this.concreteEntityAdapter.name}Options`;
    }
    get fullTextInputTypeName() {
        return `${this.concreteEntityAdapter.name}Fulltext`;
    }
    getFullTextIndexInputTypeName(indexName) {
        return `${this.concreteEntityAdapter.name}${(0, upper_first_1.upperFirst)(indexName)}Fulltext`;
    }
    getFullTextIndexQueryFieldName(indexName) {
        return `${this.concreteEntityAdapter.plural}Fulltext${(0, upper_first_1.upperFirst)(indexName)}`;
    }
    get sortInputTypeName() {
        return `${this.concreteEntityAdapter.name}Sort`;
    }
    get relationInputTypeName() {
        return `${this.concreteEntityAdapter.name}RelationInput`;
    }
    get connectInputTypeName() {
        return `${this.concreteEntityAdapter.name}ConnectInput`;
    }
    get connectOrCreateInputTypeName() {
        return `${this.concreteEntityAdapter.name}ConnectOrCreateInput`;
    }
    get disconnectInputTypeName() {
        return `${this.concreteEntityAdapter.name}DisconnectInput`;
    }
    get onCreateInputTypeName() {
        return `${this.concreteEntityAdapter.name}OnCreateInput`;
    }
    get subscriptionEventPayloadTypeName() {
        return `${this.concreteEntityAdapter.name}EventPayload`;
    }
    get subscriptionWhereInputTypeName() {
        return `${this.concreteEntityAdapter.name}SubscriptionWhere`;
    }
    get relationshipsSubscriptionWhereInputTypeName() {
        return `${this.concreteEntityAdapter.name}RelationshipsSubscriptionWhere`;
    }
    get relationshipCreatedSubscriptionWhereInputTypeName() {
        return `${this.concreteEntityAdapter.name}RelationshipCreatedSubscriptionWhere`;
    }
    get relationshipDeletedSubscriptionWhereInputTypeName() {
        return `${this.concreteEntityAdapter.name}RelationshipDeletedSubscriptionWhere`;
    }
    get rootTypeFieldNames() {
        return {
            create: `create${this.pascalCasePlural}`,
            read: this.concreteEntityAdapter.plural,
            update: `update${this.pascalCasePlural}`,
            delete: `delete${this.pascalCasePlural}`,
            aggregate: `${this.concreteEntityAdapter.plural}Aggregate`,
            connection: `${this.concreteEntityAdapter.plural}Connection`,
            subscribe: {
                created: `${this.concreteEntityAdapter.singular}Created`,
                updated: `${this.concreteEntityAdapter.singular}Updated`,
                deleted: `${this.concreteEntityAdapter.singular}Deleted`,
                relationship_deleted: `${this.concreteEntityAdapter.singular}RelationshipDeleted`,
                relationship_created: `${this.concreteEntityAdapter.singular}RelationshipCreated`,
            },
        };
    }
    get fulltextTypeNames() {
        return {
            result: `${this.pascalCaseSingular}FulltextResult`,
            where: `${this.pascalCaseSingular}FulltextWhere`,
            sort: `${this.pascalCaseSingular}FulltextSort`,
        };
    }
    get aggregateTypeNames() {
        return {
            selection: `${this.concreteEntityAdapter.name}AggregateSelection`,
            input: `${this.concreteEntityAdapter.name}AggregateSelectionInput`,
        };
    }
    get mutationResponseTypeNames() {
        return {
            create: `Create${this.pascalCasePlural}MutationResponse`,
            update: `Update${this.pascalCasePlural}MutationResponse`,
        };
    }
    get subscriptionEventTypeNames() {
        return {
            create: `${this.pascalCaseSingular}CreatedEvent`,
            update: `${this.pascalCaseSingular}UpdatedEvent`,
            delete: `${this.pascalCaseSingular}DeletedEvent`,
            create_relationship: `${this.pascalCaseSingular}RelationshipCreatedEvent`,
            delete_relationship: `${this.pascalCaseSingular}RelationshipDeletedEvent`,
        };
    }
    get subscriptionEventPayloadFieldNames() {
        return {
            create: `created${this.pascalCaseSingular}`,
            update: `updated${this.pascalCaseSingular}`,
            delete: `deleted${this.pascalCaseSingular}`,
            create_relationship: `${this.concreteEntityAdapter.singular}`,
            delete_relationship: `${this.concreteEntityAdapter.singular}`,
        };
    }
    get updateMutationArgumentNames() {
        return {
            connect: this.connectInputTypeName,
            disconnect: this.disconnectInputTypeName,
            create: this.relationInputTypeName,
            update: this.updateInputTypeName,
            delete: this.deleteInputTypeName,
            connectOrCreate: this.connectOrCreateInputTypeName,
            where: this.whereInputTypeName,
        };
    }
    get createMutationArgumentNames() {
        return {
            input: `[${this.createInputTypeName}!]!`,
        };
    }
    get connectOrCreateWhereInputFieldNames() {
        return {
            node: `${this.uniqueWhereInputTypeName}!`,
        };
    }
}
exports.ConcreteEntityOperations = ConcreteEntityOperations;
//# sourceMappingURL=ConcreteEntityOperations.js.map