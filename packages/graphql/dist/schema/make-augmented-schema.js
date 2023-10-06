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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const Scalars = __importStar(require("../graphql/scalars"));
const aggregation_types_mapper_1 = require("./aggregations/aggregation-types-mapper");
const fulltext_1 = require("./augment/fulltext");
const ensure_non_empty_input_1 = require("./ensure-non-empty-input");
const get_custom_resolvers_1 = __importDefault(require("./get-custom-resolvers"));
const get_definition_nodes_1 = require("./get-definition-nodes");
const get_obj_field_meta_1 = __importDefault(require("./get-obj-field-meta"));
const cypher_1 = require("./resolvers/field/cypher");
const create_1 = require("./resolvers/mutation/create");
const delete_1 = require("./resolvers/mutation/delete");
const update_1 = require("./resolvers/mutation/update");
const aggregate_1 = require("./resolvers/query/aggregate");
const read_1 = require("./resolvers/query/read");
const root_connection_1 = require("./resolvers/query/root-connection");
const to_compose_1 = require("./to-compose");
const CreateInfo_1 = require("../graphql/objects/CreateInfo");
const DeleteInfo_1 = require("../graphql/objects/DeleteInfo");
const PageInfo_1 = require("../graphql/objects/PageInfo");
const UpdateInfo_1 = require("../graphql/objects/UpdateInfo");
const OperationAdapter_1 = require("../schema-model/OperationAdapter");
const InterfaceEntity_1 = require("../schema-model/entity/InterfaceEntity");
const UnionEntity_1 = require("../schema-model/entity/UnionEntity");
const ConcreteEntityAdapter_1 = require("../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../schema-model/entity/model-adapters/UnionEntityAdapter");
const utils_1 = require("../utils/utils");
const create_connection_fields_1 = require("./create-connection-fields");
const create_global_nodes_1 = require("./create-global-nodes");
const create_relationship_fields_1 = require("./create-relationship-fields/create-relationship-fields");
const deprecation_map_1 = require("./deprecation-map");
const aggregate_types_1 = require("./generation/aggregate-types");
const create_input_1 = require("./generation/create-input");
const interface_type_1 = require("./generation/interface-type");
const object_type_1 = require("./generation/object-type");
const response_types_1 = require("./generation/response-types");
const sort_and_options_input_1 = require("./generation/sort-and-options-input");
const update_input_1 = require("./generation/update-input");
const where_input_1 = require("./generation/where-input");
const get_nodes_1 = __importDefault(require("./get-nodes"));
const get_resolve_and_subscription_methods_1 = require("./get-resolve-and-subscription-methods");
const filter_interface_types_1 = require("./make-augmented-schema/filter-interface-types");
const user_defined_directives_1 = require("./make-augmented-schema/user-defined-directives");
const generate_subscription_types_1 = require("./subscriptions/generate-subscription-types");
const AugmentedSchemaGenerator_1 = require("./generation/AugmentedSchemaGenerator");
function definitionNodeHasName(x) {
    return "name" in x;
}
function makeAugmentedSchema({ document, features, userCustomResolvers, subgraph, schemaModel, _experimental, }) {
    const composer = new graphql_compose_1.SchemaComposer();
    const callbacks = features?.populatedBy?.callbacks;
    let relationships = [];
    const definitionNodes = (0, get_definition_nodes_1.getDefinitionNodes)(document);
    const customResolvers = (0, get_custom_resolvers_1.default)(document);
    const { interfaceTypes, scalarTypes, objectTypes, enumTypes, unionTypes, schemaExtensions } = definitionNodes;
    // TODO: maybe use schemaModel.definitionCollection instead of definitionNodes? need to add inputObjectTypes and customResolvers
    const schemaGenerator = new AugmentedSchemaGenerator_1.AugmentedSchemaGenerator(schemaModel, definitionNodes, [customResolvers.customQuery, customResolvers.customMutation, customResolvers.customSubscription].filter((x) => Boolean(x)));
    const generatorComposer = schemaGenerator.generate();
    composer.merge(generatorComposer);
    // TODO: move these to SchemaGenerator once the other types are moved (in the meantime references to object types are causing errors because they are not present in the generated schema)
    const pipedDefs = [
        ...definitionNodes.enumTypes,
        ...definitionNodes.scalarTypes,
        ...definitionNodes.inputObjectTypes,
        ...definitionNodes.unionTypes,
        ...definitionNodes.directives,
        ...(0, utils_1.filterTruthy)([
            customResolvers.customQuery,
            customResolvers.customMutation,
            customResolvers.customSubscription,
        ]),
    ];
    if (pipedDefs.length) {
        composer.addTypeDefs((0, graphql_1.print)({ kind: graphql_1.Kind.DOCUMENT, definitions: pipedDefs }));
    }
    // Loop over all entries in the deprecation map and add field deprecations to all types in the map.
    for (const [typeName, deprecatedFields] of deprecation_map_1.deprecationMap) {
        const typeComposer = composer.getOTC(typeName);
        typeComposer.deprecateFields(deprecatedFields.reduce((acc, { field, reason }) => ({ ...acc, [field]: reason }), {}));
    }
    // TODO: ideally move these in getSubgraphSchema()
    if (subgraph) {
        const shareable = subgraph.getFullyQualifiedDirectiveName("shareable");
        [CreateInfo_1.CreateInfo.name, UpdateInfo_1.UpdateInfo.name, DeleteInfo_1.DeleteInfo.name, PageInfo_1.PageInfo.name].forEach((typeName) => {
            const typeComposer = composer.getOTC(typeName);
            typeComposer.setDirectiveByName(shareable);
        });
    }
    const aggregationTypesMapper = new aggregation_types_mapper_1.AggregationTypesMapper(composer, subgraph);
    const getNodesResult = (0, get_nodes_1.default)(definitionNodes, { callbacks, userCustomResolvers });
    const { nodes, relationshipPropertyInterfaceNames, interfaceRelationshipNames } = getNodesResult;
    const hasGlobalNodes = (0, create_global_nodes_1.addGlobalNodeFields)(nodes, composer);
    const { relationshipProperties, interfaceRelationships, filteredInterfaceTypes } = (0, filter_interface_types_1.filterInterfaceTypes)(interfaceTypes, relationshipPropertyInterfaceNames, interfaceRelationshipNames);
    const { userDefinedFieldDirectivesForNode, userDefinedDirectivesForNode, propagatedDirectivesForNode, userDefinedDirectivesForInterface, } = (0, user_defined_directives_1.getUserDefinedDirectives)(definitionNodes);
    /**
     * TODO [translation-layer-compatibility]
     * keeping this `relationshipFields` scaffold for backwards compatibility on translation layer
     * actual functional logic is in schemaModel.concreteEntities.forEach
     */
    const relationshipFields = new Map();
    relationshipProperties.forEach((relationship) => {
        const relFields = (0, get_obj_field_meta_1.default)({
            enums: enumTypes,
            interfaces: filteredInterfaceTypes,
            objects: objectTypes,
            scalars: scalarTypes,
            unions: unionTypes,
            obj: relationship,
            callbacks,
        });
        relationshipFields.set(relationship.name.value, relFields);
    });
    // this is the new "functional" way for the above forEach
    // helper to only create relationshipProperties Interface types once, even if multiple relationships reference it
    const seenRelationshipPropertiesInterfaces = new Set();
    schemaModel.concreteEntities.forEach((concreteEntity) => {
        const concreteEntityAdapter = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(concreteEntity);
        for (const relationshipAdapter of concreteEntityAdapter.relationships.values()) {
            {
                if (!relationshipAdapter.propertiesTypeName ||
                    seenRelationshipPropertiesInterfaces.has(relationshipAdapter.propertiesTypeName)) {
                    continue;
                }
                doForRelationshipPropertiesInterface({
                    composer,
                    relationshipAdapter,
                    userDefinedDirectivesForInterface,
                    userDefinedFieldDirectivesForNode,
                    features,
                });
                seenRelationshipPropertiesInterfaces.add(relationshipAdapter.propertiesTypeName);
            }
        }
    });
    // temporary helper to keep track of which interface entities were already "visited"
    // currently generated schema depends on these types being created BEFORE the rest
    // ideally the dependency should be eradicated and these should be part of the schemaModel.compositeEntities.forEach
    const seenInterfaces = new Set();
    interfaceRelationships.forEach((interfaceRelationship) => {
        const interfaceEntity = schemaModel.getEntity(interfaceRelationship.name.value);
        const interfaceEntityAdapter = new InterfaceEntityAdapter_1.InterfaceEntityAdapter(interfaceEntity);
        const updatedRelationships = doForInterfacesThatAreTargetOfARelationship({
            composer,
            interfaceEntityAdapter,
            subgraph,
            relationships,
            relationshipFields,
            userDefinedFieldDirectivesForNode,
        });
        if (updatedRelationships) {
            relationships = updatedRelationships;
        }
        seenInterfaces.add(interfaceRelationship.name.value);
    });
    schemaModel.concreteEntities.forEach((concreteEntity) => {
        /**
         * TODO [translation-layer-compatibility]
         * need the node for fulltext translation
         */
        const node = nodes.find((n) => n.name === concreteEntity.name);
        if (!node) {
            throw new Error(`Node not found with the name ${concreteEntity.name}`);
        }
        const concreteEntityAdapter = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(concreteEntity);
        const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(concreteEntityAdapter.name);
        if (!userDefinedFieldDirectives) {
            throw new Error(`User defined field directives not found for ${concreteEntityAdapter.name}`);
        }
        const propagatedDirectives = propagatedDirectivesForNode.get(concreteEntity.name) || [];
        const userDefinedObjectDirectives = (userDefinedDirectivesForNode.get(concreteEntity.name) || []).concat(propagatedDirectives);
        (0, sort_and_options_input_1.withOptionsInputType)({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, composer });
        (0, aggregate_types_1.withAggregateSelectionType)({ concreteEntityAdapter, aggregationTypesMapper, propagatedDirectives, composer });
        (0, where_input_1.withWhereInputType)({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, features, composer });
        /**
         * TODO [translation-layer-compatibility]
         * Need to migrate resolvers, which themselves rely on the translation layer being migrated to the new schema model
         */
        (0, fulltext_1.augmentFulltextSchema)(node, composer, concreteEntityAdapter);
        (0, where_input_1.withUniqueWhereInputType)({ concreteEntityAdapter, composer });
        (0, create_input_1.withCreateInputType)({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, composer });
        (0, update_input_1.withUpdateInputType)({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, composer });
        (0, response_types_1.withMutationResponseTypes)({ concreteEntityAdapter, propagatedDirectives, composer });
        const composeNode = (0, object_type_1.withObjectType)({
            concreteEntityAdapter,
            userDefinedFieldDirectives,
            userDefinedObjectDirectives,
            composer,
        });
        (0, create_relationship_fields_1.createRelationshipFields)({
            entityAdapter: concreteEntityAdapter,
            schemaComposer: composer,
            composeNode,
            subgraph,
            userDefinedFieldDirectives,
        });
        relationships = [
            ...relationships,
            ...(0, create_connection_fields_1.createConnectionFields)({
                entityAdapter: concreteEntityAdapter,
                schemaComposer: composer,
                composeNode,
                userDefinedFieldDirectives,
                relationshipFields,
            }),
        ];
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, concreteEntityAdapter.operations.updateInputTypeName);
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, concreteEntityAdapter.operations.createInputTypeName);
        if (concreteEntityAdapter.isReadable) {
            composer.Query.addFields({
                [concreteEntityAdapter.operations.rootTypeFieldNames.read]: (0, read_1.findResolver)({
                    node,
                    concreteEntityAdapter,
                }),
            });
            composer.Query.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.read, (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives));
            composer.Query.addFields({
                [concreteEntityAdapter.operations.rootTypeFieldNames.connection]: (0, root_connection_1.rootConnectionResolver)({
                    node,
                    composer,
                    concreteEntityAdapter,
                    propagatedDirectives,
                }),
            });
            composer.Query.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.connection, (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives));
        }
        if (concreteEntityAdapter.isAggregable) {
            composer.Query.addFields({
                [concreteEntityAdapter.operations.rootTypeFieldNames.aggregate]: (0, aggregate_1.aggregateResolver)({
                    node,
                    concreteEntityAdapter,
                }),
            });
            composer.Query.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.aggregate, (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives));
        }
        if (concreteEntityAdapter.isCreatable) {
            composer.Mutation.addFields({
                [concreteEntityAdapter.operations.rootTypeFieldNames.create]: (0, create_1.createResolver)({
                    node,
                    concreteEntityAdapter,
                }),
            });
            composer.Mutation.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.create, (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives));
        }
        if (concreteEntityAdapter.isDeletable) {
            composer.Mutation.addFields({
                [concreteEntityAdapter.operations.rootTypeFieldNames.delete]: (0, delete_1.deleteResolver)({
                    node,
                    composer,
                    concreteEntityAdapter,
                }),
            });
            composer.Mutation.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.delete, (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives));
        }
        if (concreteEntityAdapter.isUpdatable) {
            composer.Mutation.addFields({
                [concreteEntityAdapter.operations.rootTypeFieldNames.update]: (0, update_1.updateResolver)({
                    node,
                    composer,
                    concreteEntityAdapter,
                }),
            });
            composer.Mutation.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.update, (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives));
        }
    });
    schemaModel.compositeEntities.forEach((entity) => {
        if (entity instanceof UnionEntity_1.UnionEntity) {
            (0, where_input_1.withWhereInputType)({
                entityAdapter: new UnionEntityAdapter_1.UnionEntityAdapter(entity),
                userDefinedFieldDirectives: new Map(),
                features,
                composer,
            });
            return;
        }
        if (entity instanceof InterfaceEntity_1.InterfaceEntity && !seenInterfaces.has(entity.name)) {
            const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(entity.name);
            const userDefinedInterfaceDirectives = userDefinedDirectivesForInterface.get(entity.name) || [];
            (0, interface_type_1.withInterfaceType)({
                entityAdapter: new InterfaceEntityAdapter_1.InterfaceEntityAdapter(entity),
                userDefinedFieldDirectives,
                userDefinedInterfaceDirectives,
                composer,
                config: {
                    includeRelationships: true,
                },
            });
            return;
        }
        return;
    });
    if (Boolean(features?.subscriptions) && nodes.length) {
        (0, generate_subscription_types_1.generateSubscriptionTypes)({
            schemaComposer: composer,
            schemaModel,
            userDefinedFieldDirectivesForNode,
        });
    }
    ["Query", "Mutation"].forEach((type) => {
        const objectComposer = composer[type];
        const operation = schemaModel.operations[type];
        if (!operation) {
            return;
        }
        const operationAdapter = new OperationAdapter_1.OperationAdapter(operation);
        const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(type);
        for (const attributeAdapter of operationAdapter.attributes.values()) {
            /**
             * TODO [translation-layer-compatibility]
             * needed for compatibility with translation layer
             */
            const objectFields = (0, get_obj_field_meta_1.default)({
                obj: customResolvers[`customCypher${type}`],
                scalars: scalarTypes,
                enums: enumTypes,
                interfaces: filteredInterfaceTypes,
                unions: unionTypes,
                objects: objectTypes,
                callbacks,
            });
            const field = objectFields.cypherFields.find((f) => f.fieldName === attributeAdapter.name);
            const customResolver = (0, cypher_1.cypherResolver)({
                field,
                attributeAdapter,
                type: type,
            });
            const composedField = (0, to_compose_1.attributeAdapterToComposeFields)([attributeAdapter], userDefinedFieldDirectives)[attributeAdapter.name];
            objectComposer.addFields({ [attributeAdapter.name]: { ...composedField, ...customResolver } });
        }
    });
    if (!Object.values(composer.Mutation.getFields()).length) {
        composer.delete("Mutation");
    }
    if (!Object.values(composer.Subscription.getFields()).length) {
        composer.delete("Subscription");
    }
    const generatedTypeDefs = composer.toSDL();
    let parsedDoc = (0, graphql_1.parse)(generatedTypeDefs);
    const documentNames = new Set(parsedDoc.definitions.filter(definitionNodeHasName).map((x) => x.name.value));
    const resolveMethods = (0, get_resolve_and_subscription_methods_1.getResolveAndSubscriptionMethods)(composer);
    const generatedResolveMethods = {};
    for (const [key, value] of Object.entries(resolveMethods)) {
        if (documentNames.has(key)) {
            generatedResolveMethods[key] = value;
        }
    }
    const generatedResolvers = {
        ...generatedResolveMethods,
        ...Object.values(Scalars).reduce((res, scalar) => {
            if (generatedTypeDefs.includes(`scalar ${scalar.name}\n`)) {
                res[scalar.name] = scalar;
            }
            return res;
        }, {}),
        ...(hasGlobalNodes ? { Node: { __resolveType: (root) => root.__resolveType } } : {}),
    };
    unionTypes.forEach((union) => {
        // It is possible to make union types "writeonly". In this case adding a resolver for them breaks schema generation.
        const unionTypeInSchema = parsedDoc.definitions.find((def) => {
            if (def.kind === graphql_1.Kind.UNION_TYPE_DEFINITION && def.name.value === union.name.value)
                return true;
            return false;
        });
        if (!generatedResolvers[union.name.value] && unionTypeInSchema) {
            generatedResolvers[union.name.value] = { __resolveType: (root) => root.__resolveType };
        }
    });
    interfaceRelationships.forEach((i) => {
        if (!generatedResolvers[i.name.value]) {
            generatedResolvers[i.name.value] = { __resolveType: (root) => root.__resolveType };
        }
    });
    // do not propagate Neo4jGraphQL directives on schema extensions
    const schemaExtensionsWithoutNeo4jDirectives = schemaExtensions.map((schemaExtension) => {
        return {
            kind: schemaExtension.kind,
            loc: schemaExtension.loc,
            operationTypes: schemaExtension.operationTypes,
            directives: schemaExtension.directives?.filter((schemaDirective) => !["query", "mutation", "subscription", "authentication"].includes(schemaDirective.name.value)),
        };
    });
    const seen = {};
    parsedDoc = {
        ...parsedDoc,
        definitions: [
            ...parsedDoc.definitions.filter((definition) => {
                // Filter out default scalars, they are not needed and can cause issues
                if (definition.kind === graphql_1.Kind.SCALAR_TYPE_DEFINITION) {
                    if ([
                        graphql_1.GraphQLBoolean.name,
                        graphql_1.GraphQLFloat.name,
                        graphql_1.GraphQLID.name,
                        graphql_1.GraphQLInt.name,
                        graphql_1.GraphQLString.name,
                    ].includes(definition.name.value)) {
                        return false;
                    }
                }
                if (!("name" in definition)) {
                    return true;
                }
                const n = definition.name?.value;
                if (seen[n]) {
                    return false;
                }
                seen[n] = n;
                return true;
            }),
            ...schemaExtensionsWithoutNeo4jDirectives,
        ],
    };
    return {
        nodes,
        relationships,
        typeDefs: parsedDoc,
        resolvers: generatedResolvers,
    };
}
exports.default = makeAugmentedSchema;
function doForRelationshipPropertiesInterface({ composer, relationshipAdapter, userDefinedDirectivesForInterface, userDefinedFieldDirectivesForNode, features, }) {
    if (!relationshipAdapter.propertiesTypeName) {
        return;
    }
    const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(relationshipAdapter.propertiesTypeName);
    const userDefinedInterfaceDirectives = userDefinedDirectivesForInterface.get(relationshipAdapter.name) || [];
    (0, interface_type_1.withInterfaceType)({
        entityAdapter: relationshipAdapter,
        userDefinedFieldDirectives,
        userDefinedInterfaceDirectives,
        composer,
    });
    (0, sort_and_options_input_1.withSortInputType)({ relationshipAdapter, userDefinedFieldDirectives, composer });
    (0, update_input_1.withUpdateInputType)({ entityAdapter: relationshipAdapter, userDefinedFieldDirectives, composer });
    (0, where_input_1.withWhereInputType)({ entityAdapter: relationshipAdapter, userDefinedFieldDirectives, features, composer });
    (0, create_input_1.withCreateInputType)({ entityAdapter: relationshipAdapter, userDefinedFieldDirectives, composer });
}
function doForInterfacesThatAreTargetOfARelationship({ composer, interfaceEntityAdapter, features, subgraph, relationships, relationshipFields, userDefinedFieldDirectivesForNode, }) {
    const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(interfaceEntityAdapter.name);
    (0, sort_and_options_input_1.withOptionsInputType)({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, composer });
    (0, where_input_1.withWhereInputType)({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, features, composer });
    (0, create_input_1.withCreateInputType)({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, composer });
    (0, update_input_1.withUpdateInputType)({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, composer });
    const composeInterface = (0, interface_type_1.withInterfaceType)({
        entityAdapter: interfaceEntityAdapter,
        userDefinedFieldDirectives,
        userDefinedInterfaceDirectives: [],
        composer,
    });
    (0, create_relationship_fields_1.createRelationshipFields)({
        entityAdapter: interfaceEntityAdapter,
        schemaComposer: composer,
        composeNode: composeInterface,
        subgraph,
        userDefinedFieldDirectives,
    });
    relationships = [
        ...relationships,
        ...(0, create_connection_fields_1.createConnectionFields)({
            entityAdapter: interfaceEntityAdapter,
            schemaComposer: composer,
            composeNode: composeInterface,
            userDefinedFieldDirectives,
            relationshipFields,
        }),
    ];
    return relationships;
}
//# sourceMappingURL=make-augmented-schema.js.map