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
exports.generateSubscriptionTypes = void 0;
const graphql_1 = require("graphql");
const EventType_1 = require("../../graphql/enums/EventType");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const subscribe_1 = require("../resolvers/subscriptions/subscribe");
const to_compose_1 = require("../to-compose");
const generate_subscription_connection_types_1 = require("./generate-subscription-connection-types");
const generate_subscription_where_type_1 = require("./generate-subscription-where-type");
function generateSubscriptionTypes({ schemaComposer, schemaModel, userDefinedFieldDirectivesForNode, }) {
    const subscriptionComposer = schemaComposer.Subscription;
    const eventTypeEnum = schemaComposer.createEnumTC(EventType_1.EventType);
    const allNodes = schemaModel.concreteEntities.map((e) => new ConcreteEntityAdapter_1.ConcreteEntityAdapter(e));
    const nodeNameToEventPayloadTypes = allNodes.reduce((acc, entityAdapter) => {
        const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(entityAdapter.name);
        if (!userDefinedFieldDirectives) {
            throw new Error("fix user directives for object types in subscriptions.");
        }
        const eventPayloadType = schemaComposer.createObjectTC({
            name: entityAdapter.operations.subscriptionEventPayloadTypeName,
            fields: (0, to_compose_1.attributeAdapterToComposeFields)(entityAdapter.subscriptionEventPayloadFields, userDefinedFieldDirectives),
        });
        acc[entityAdapter.name] = eventPayloadType;
        return acc;
    }, {});
    allNodes.forEach((entityAdapter) => (0, generate_subscription_where_type_1.generateSubscriptionWhereType)(entityAdapter, schemaComposer));
    const nodeToRelationFieldMap = new Map();
    const nodesWithSubscriptionOperation = allNodes.filter((e) => e.isSubscribable);
    nodesWithSubscriptionOperation.forEach((entityAdapter) => {
        const eventPayload = nodeNameToEventPayloadTypes[entityAdapter.name];
        const where = (0, generate_subscription_where_type_1.generateSubscriptionWhereType)(entityAdapter, schemaComposer);
        const nodeCreatedEvent = schemaComposer.createObjectTC({
            name: entityAdapter.operations.subscriptionEventTypeNames.create,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("CREATE")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const nodeUpdatedEvent = schemaComposer.createObjectTC({
            name: entityAdapter.operations.subscriptionEventTypeNames.update,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("UPDATE")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const nodeDeletedEvent = schemaComposer.createObjectTC({
            name: entityAdapter.operations.subscriptionEventTypeNames.delete,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("DELETE")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const relationshipCreatedEvent = schemaComposer.createObjectTC({
            name: entityAdapter.operations.subscriptionEventTypeNames.create_relationship,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("CREATE_RELATIONSHIP")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const relationshipDeletedEvent = schemaComposer.createObjectTC({
            name: entityAdapter.operations.subscriptionEventTypeNames.delete_relationship,
            fields: {
                event: {
                    type: eventTypeEnum.NonNull,
                    resolve: () => EventType_1.EventType.getValue("DELETE_RELATIONSHIP")?.value,
                },
                timestamp: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
                    resolve: (source) => source.timestamp,
                },
            },
        });
        const connectedTypes = (0, generate_subscription_connection_types_1.getConnectedTypes)({
            entityAdapter,
            schemaComposer,
            nodeNameToEventPayloadTypes,
            userDefinedFieldDirectivesForNode,
        });
        const relationsEventPayload = schemaComposer.createObjectTC({
            name: `${entityAdapter.name}ConnectedRelationships`,
            fields: connectedTypes,
        });
        if ((0, generate_subscription_connection_types_1.hasProperties)(eventPayload)) {
            nodeCreatedEvent.addFields({
                [entityAdapter.operations.subscriptionEventPayloadFieldNames.create]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.new,
                },
            });
            nodeUpdatedEvent.addFields({
                previousState: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.old,
                },
                [entityAdapter.operations.subscriptionEventPayloadFieldNames.update]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.new,
                },
            });
            nodeDeletedEvent.addFields({
                [entityAdapter.operations.subscriptionEventPayloadFieldNames.delete]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => source.properties.old,
                },
            });
            relationshipCreatedEvent.addFields({
                [entityAdapter.operations.subscriptionEventPayloadFieldNames.create_relationship]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => {
                        return getRelationshipEventDataForNode(source, entityAdapter, nodeToRelationFieldMap)
                            .properties;
                    },
                },
                relationshipFieldName: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    resolve: (source) => {
                        return getRelationField({
                            entityAdapter,
                            relationshipName: source.relationshipName,
                            nodeToRelationFieldMap,
                        })?.name;
                    },
                },
            });
            relationshipDeletedEvent.addFields({
                [entityAdapter.operations.subscriptionEventPayloadFieldNames.delete_relationship]: {
                    type: eventPayload.NonNull,
                    resolve: (source) => {
                        return getRelationshipEventDataForNode(source, entityAdapter, nodeToRelationFieldMap)
                            .properties;
                    },
                },
                relationshipFieldName: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    resolve: (source) => {
                        return getRelationField({
                            entityAdapter,
                            relationshipName: source.relationshipName,
                            nodeToRelationFieldMap,
                        })?.name;
                    },
                },
            });
        }
        if ((0, generate_subscription_connection_types_1.hasProperties)(relationsEventPayload)) {
            const resolveRelationship = (source) => {
                const thisRel = getRelationField({
                    entityAdapter,
                    relationshipName: source.relationshipName,
                    nodeToRelationFieldMap,
                });
                if (!thisRel) {
                    return;
                }
                const { destinationProperties: props, destinationTypename: typename } = getRelationshipEventDataForNode(source, entityAdapter, nodeToRelationFieldMap);
                return {
                    [thisRel.name]: {
                        ...source.properties.relationship,
                        node: {
                            ...props,
                            __typename: `${typename}EventPayload`,
                        },
                    },
                };
            };
            relationshipCreatedEvent.addFields({
                createdRelationship: {
                    type: relationsEventPayload.NonNull,
                    resolve: resolveRelationship,
                },
            });
            relationshipDeletedEvent.addFields({
                deletedRelationship: {
                    type: relationsEventPayload.NonNull,
                    resolve: resolveRelationship,
                },
            });
        }
        const whereArgument = where && { args: { where } };
        if (entityAdapter.isSubscribableOnCreate) {
            subscriptionComposer.addFields({
                [entityAdapter.operations.rootTypeFieldNames.subscribe.created]: {
                    ...whereArgument,
                    type: nodeCreatedEvent.NonNull,
                    subscribe: (0, subscribe_1.generateSubscribeMethod)({ entityAdapter, type: "create" }),
                    resolve: subscribe_1.subscriptionResolve,
                },
            });
        }
        if (entityAdapter.isSubscribableOnUpdate) {
            subscriptionComposer.addFields({
                [entityAdapter.operations.rootTypeFieldNames.subscribe.updated]: {
                    ...whereArgument,
                    type: nodeUpdatedEvent.NonNull,
                    subscribe: (0, subscribe_1.generateSubscribeMethod)({ entityAdapter, type: "update" }),
                    resolve: subscribe_1.subscriptionResolve,
                },
            });
        }
        if (entityAdapter.isSubscribableOnDelete) {
            subscriptionComposer.addFields({
                [entityAdapter.operations.rootTypeFieldNames.subscribe.deleted]: {
                    ...whereArgument,
                    type: nodeDeletedEvent.NonNull,
                    subscribe: (0, subscribe_1.generateSubscribeMethod)({ entityAdapter, type: "delete" }),
                    resolve: subscribe_1.subscriptionResolve,
                },
            });
        }
        const connectionWhere = (0, generate_subscription_where_type_1.generateSubscriptionConnectionWhereType)({
            entityAdapter,
            schemaComposer,
        });
        if (entityAdapter.relationships.size > 0) {
            if (entityAdapter.isSubscribableOnRelationshipCreate) {
                subscriptionComposer.addFields({
                    [entityAdapter.operations.rootTypeFieldNames.subscribe.relationship_created]: {
                        ...(connectionWhere?.created && { args: { where: connectionWhere?.created } }),
                        type: relationshipCreatedEvent.NonNull,
                        subscribe: (0, subscribe_1.generateSubscribeMethod)({
                            entityAdapter,
                            type: "create_relationship",
                        }),
                        resolve: subscribe_1.subscriptionResolve,
                    },
                });
            }
            if (entityAdapter.isSubscribableOnRelationshipDelete) {
                subscriptionComposer.addFields({
                    [entityAdapter.operations.rootTypeFieldNames.subscribe.relationship_deleted]: {
                        ...(connectionWhere?.deleted && { args: { where: connectionWhere?.deleted } }),
                        type: relationshipDeletedEvent.NonNull,
                        subscribe: (0, subscribe_1.generateSubscribeMethod)({
                            entityAdapter,
                            type: "delete_relationship",
                        }),
                        resolve: subscribe_1.subscriptionResolve,
                    },
                });
            }
        }
    });
}
exports.generateSubscriptionTypes = generateSubscriptionTypes;
function getRelationshipEventDataForNode(event, entityAdapter, nodeToRelationFieldMap) {
    // TODO:can I refactor this?
    let condition = event.toTypename === entityAdapter.name;
    if (event.toTypename === event.fromTypename) {
        // must check relationship direction from schema
        const relationship = getRelationField({
            entityAdapter,
            relationshipName: event.relationshipName,
            nodeToRelationFieldMap,
        });
        condition = relationship?.direction === "IN";
    }
    if (condition) {
        return {
            direction: "IN",
            properties: event.properties.to,
            destinationProperties: event.properties.from,
            destinationTypename: event.fromTypename,
        };
    }
    return {
        direction: "OUT",
        properties: event.properties.from,
        destinationProperties: event.properties.to,
        destinationTypename: event.toTypename,
    };
}
function getRelationField({ entityAdapter, relationshipName, nodeToRelationFieldMap, }) {
    // TODO: move to schemaModel intermediate representation
    // TODO: relationships by propertiesTypeName instead of by fieldName
    // TODO: need to identify exact the relationship given an entity and an event (has relationshipName/type, toTypename, fromTypename)
    let relationshipNameToRelationField;
    if (!nodeToRelationFieldMap.has(entityAdapter)) {
        relationshipNameToRelationField = new Map();
        nodeToRelationFieldMap.set(entityAdapter, relationshipNameToRelationField);
    }
    else {
        relationshipNameToRelationField = nodeToRelationFieldMap.get(entityAdapter);
    }
    if (!relationshipNameToRelationField.has(relationshipName)) {
        const relationField = Array.from(entityAdapter.relationships.values()).find((f) => f.type === relationshipName);
        relationshipNameToRelationField.set(relationshipName, relationField);
    }
    return relationshipNameToRelationField.get(relationshipName);
}
//# sourceMappingURL=generate-subscription-types.js.map