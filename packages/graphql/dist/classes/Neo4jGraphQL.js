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
const merge_1 = require("@graphql-tools/merge");
const debug_1 = __importDefault(require("debug"));
const schema_1 = require("../schema");
const verify_database_1 = __importDefault(require("./utils/verify-database"));
const asserts_indexes_and_constraints_1 = require("./utils/asserts-indexes-and-constraints");
const wrap_query_and_mutation_1 = require("../schema/resolvers/composition/wrap-query-and-mutation");
const defaultField_1 = require("../schema/resolvers/field/defaultField");
const utils_1 = require("../utils/utils");
const constants_1 = require("../constants");
const Neo4jDatabaseInfo_1 = require("./Neo4jDatabaseInfo");
const Executor_1 = require("./Executor");
const generate_model_1 = require("../schema-model/generate-model");
const resolvers_composition_1 = require("@graphql-tools/resolvers-composition");
const schema_2 = require("@graphql-tools/schema");
const utils_2 = require("@graphql-tools/utils");
const validation_1 = require("../schema/validation");
const schema_validation_1 = require("../schema/validation/schema-validation");
const make_document_to_augment_1 = require("../schema/make-document-to-augment");
const Neo4jGraphQLAuthorization_1 = require("./authorization/Neo4jGraphQLAuthorization");
const Neo4jGraphQLSubscriptionsDefaultEngine_1 = require("./subscription/Neo4jGraphQLSubscriptionsDefaultEngine");
const wrap_subscription_1 = require("../schema/resolvers/composition/wrap-subscription");
const get_definition_nodes_1 = require("../schema/get-definition-nodes");
class Neo4jGraphQL {
    constructor(input) {
        const { driver, features, typeDefs, resolvers, debug, validate = true, experimental = false } = input;
        this.driver = driver;
        this.features = this.parseNeo4jFeatures(features);
        this.typeDefs = typeDefs;
        this.resolvers = resolvers;
        this.debug = debug;
        this.validate = validate;
        this.experimental = experimental;
        this.checkEnableDebug();
        if (this.features?.authorization) {
            const authorizationSettings = this.features?.authorization;
            this.authorization = new Neo4jGraphQLAuthorization_1.Neo4jGraphQLAuthorization(authorizationSettings);
        }
    }
    async getSchema() {
        return this.getExecutableSchema();
    }
    async getExecutableSchema() {
        if (!this.executableSchema) {
            this.executableSchema = this.generateExecutableSchema();
            await this.subscriptionMechanismSetup();
        }
        return this.executableSchema;
    }
    async getSubgraphSchema() {
        console.warn("Apollo Federation support is currently experimental. There will be missing functionality, and breaking changes may occur in patch and minor releases. It is not recommended to use it in a production environment.");
        if (!this.subgraphSchema) {
            this.subgraphSchema = this.generateSubgraphSchema();
            await this.subscriptionMechanismSetup();
        }
        return this.subgraphSchema;
    }
    async checkNeo4jCompat({ driver, sessionConfig, } = {}) {
        const neo4jDriver = driver || this.driver;
        if (!neo4jDriver) {
            throw new Error("neo4j-driver Driver missing");
        }
        if (!this.dbInfo) {
            this.dbInfo = await this.getNeo4jDatabaseInfo(neo4jDriver, sessionConfig);
        }
        return (0, verify_database_1.default)({
            driver: neo4jDriver,
            sessionConfig,
            dbInfo: this.dbInfo,
        });
    }
    async assertIndexesAndConstraints({ driver, sessionConfig, options, } = {}) {
        if (!(this.executableSchema || this.subgraphSchema)) {
            throw new Error("You must await `.getSchema()` before `.assertIndexesAndConstraints()`");
        }
        await (this.executableSchema || this.subgraphSchema);
        const neo4jDriver = driver || this.driver;
        if (!neo4jDriver) {
            throw new Error("neo4j-driver Driver missing");
        }
        if (!this.dbInfo) {
            this.dbInfo = await this.getNeo4jDatabaseInfo(neo4jDriver, sessionConfig);
        }
        await (0, asserts_indexes_and_constraints_1.assertIndexesAndConstraints)({
            driver: neo4jDriver,
            sessionConfig,
            nodes: this.nodes,
            options: options,
        });
    }
    get nodes() {
        if (!this._nodes) {
            throw new Error("You must await `.getSchema()` before accessing `nodes`");
        }
        return this._nodes;
    }
    get relationships() {
        if (!this._relationships) {
            throw new Error("You must await `.getSchema()` before accessing `relationships`");
        }
        return this._relationships;
    }
    /**
     * Currently just merges all type definitions into a document. Eventual intention described below:
     *
     * Normalizes the user's type definitions using the method with the lowest risk of side effects:
     * - Type definitions of type `string` are parsed using the `parse` function from the reference GraphQL implementation.
     * - Type definitions of type `DocumentNode` are returned as they are.
     * - Type definitions in arrays are merged using `mergeTypeDefs` from `@graphql-tools/merge`.
     * - Callbacks are resolved to a type which can be parsed into a document.
     *
     * This method maps to the Type Definition Normalization stage of the Schema Generation lifecycle.
     *
     * @param {TypeDefinitions} typeDefinitions - The unnormalized type definitions.
     * @returns {DocumentNode} The normalized type definitons as a document.
     */
    normalizeTypeDefinitions(typeDefinitions) {
        // TODO: The dream: minimal modification of the type definitions. However, this does not merge extensions, which we can't currently deal with in translation.
        // if (typeof typeDefinitions === "function") {
        //     return this.normalizeTypeDefinitions(typeDefinitions());
        // }
        // if (typeof typeDefinitions === "string") {
        //     return parse(typeDefinitions);
        // }
        // if (Array.isArray(typeDefinitions)) {
        //     return mergeTypeDefs(typeDefinitions);
        // }
        // return typeDefinitions;
        return (0, merge_1.mergeTypeDefs)(typeDefinitions);
    }
    addDefaultFieldResolvers(schema) {
        (0, utils_2.forEachField)(schema, (field) => {
            if (!field.resolve) {
                field.resolve = defaultField_1.defaultFieldResolver;
            }
        });
        return schema;
    }
    checkEnableDebug() {
        if (this.debug === true || this.debug === false) {
            if (this.debug) {
                debug_1.default.enable(constants_1.DEBUG_ALL);
            }
            else {
                debug_1.default.disable();
            }
        }
    }
    async getNeo4jDatabaseInfo(driver, sessionConfig) {
        const executorConstructorParam = {
            executionContext: driver,
            sessionConfig,
        };
        return (0, Neo4jDatabaseInfo_1.getNeo4jDatabaseInfo)(new Executor_1.Executor(executorConstructorParam));
    }
    wrapResolvers(resolvers) {
        if (!this.schemaModel) {
            throw new Error("Schema Model is not defined");
        }
        const wrapResolverArgs = {
            driver: this.driver,
            nodes: this.nodes,
            relationships: this.relationships,
            schemaModel: this.schemaModel,
            features: this.features,
            authorization: this.authorization,
            jwtPayloadFieldsMap: this.jwtFieldsMap,
        };
        const resolversComposition = {
            "Query.*": [(0, wrap_query_and_mutation_1.wrapQueryAndMutation)(wrapResolverArgs)],
            "Mutation.*": [(0, wrap_query_and_mutation_1.wrapQueryAndMutation)(wrapResolverArgs)],
        };
        if (this.features.subscriptions) {
            resolversComposition["Subscription.*"] = (0, wrap_subscription_1.wrapSubscription)({
                subscriptionsEngine: this.features.subscriptions,
                schemaModel: this.schemaModel,
                authorization: this.authorization,
            });
        }
        // Merge generated and custom resolvers
        const mergedResolvers = (0, merge_1.mergeResolvers)([...(0, utils_1.asArray)(resolvers), ...(0, utils_1.asArray)(this.resolvers)]);
        return (0, resolvers_composition_1.composeResolvers)(mergedResolvers, resolversComposition);
    }
    composeSchema(schema) {
        // TODO: Keeping this in our back pocket - if we want to add native support for middleware to the library
        // if (this.middlewares) {
        //     schema = applyMiddleware(schema, ...this.middlewares);
        // }
        // Get resolvers from schema - this will include generated _entities and _service for Federation
        const resolvers = (0, utils_2.getResolversFromSchema)(schema);
        // Wrap the resolvers using resolvers composition
        const wrappedResolvers = this.wrapResolvers(resolvers);
        // Add the wrapped resolvers back to the schema, context will now be populated
        (0, schema_2.addResolversToSchema)({ schema, resolvers: wrappedResolvers, updateResolversInPlace: true });
        return this.addDefaultFieldResolvers(schema);
    }
    parseNeo4jFeatures(features) {
        let subscriptionPlugin;
        if (features?.subscriptions === true) {
            subscriptionPlugin = new Neo4jGraphQLSubscriptionsDefaultEngine_1.Neo4jGraphQLSubscriptionsDefaultEngine();
        }
        else {
            subscriptionPlugin = features?.subscriptions || undefined;
        }
        return {
            ...features,
            subscriptions: subscriptionPlugin,
        };
    }
    generateSchemaModel(document) {
        if (!this.schemaModel) {
            return (0, generate_model_1.generateModel)(document);
        }
        return this.schemaModel;
    }
    generateExecutableSchema() {
        return new Promise((resolve) => {
            const initialDocument = this.normalizeTypeDefinitions(this.typeDefs);
            if (this.validate) {
                const { enumTypes: enums, interfaceTypes: interfaces, unionTypes: unions, objectTypes: objects, } = (0, get_definition_nodes_1.getDefinitionNodes)(initialDocument);
                (0, validation_1.validateDocument)({
                    document: initialDocument,
                    features: this.features,
                    additionalDefinitions: { enums, interfaces, unions, objects },
                });
            }
            const { document, typesExcludedFromGeneration } = (0, make_document_to_augment_1.makeDocumentToAugment)(initialDocument);
            const { jwt } = typesExcludedFromGeneration;
            if (jwt) {
                this.jwtFieldsMap = jwt.jwtFieldsMap;
            }
            this.schemaModel = this.generateSchemaModel(document);
            const { nodes, relationships, typeDefs, resolvers } = (0, schema_1.makeAugmentedSchema)({
                document,
                features: this.features,
                userCustomResolvers: this.resolvers,
                schemaModel: this.schemaModel,
                _experimental: this.experimental,
            });
            if (this.validate) {
                (0, schema_validation_1.validateUserDefinition)({ userDocument: document, augmentedDocument: typeDefs, jwt: jwt?.type });
            }
            this._nodes = nodes;
            this._relationships = relationships;
            const schema = (0, schema_2.makeExecutableSchema)({
                typeDefs,
                resolvers,
            });
            resolve(this.composeSchema(schema));
        });
    }
    async generateSubgraphSchema() {
        // Import only when needed to avoid issues if GraphQL 15 being used
        const { Subgraph } = await Promise.resolve().then(() => __importStar(require("./Subgraph")));
        const initialDocument = this.normalizeTypeDefinitions(this.typeDefs);
        const subgraph = new Subgraph(this.typeDefs);
        const { directives, types } = subgraph.getValidationDefinitions();
        if (this.validate) {
            const { enumTypes: enums, interfaceTypes: interfaces, unionTypes: unions, objectTypes: objects, } = (0, get_definition_nodes_1.getDefinitionNodes)(initialDocument);
            (0, validation_1.validateDocument)({
                document: initialDocument,
                features: this.features,
                additionalDefinitions: {
                    additionalDirectives: directives,
                    additionalTypes: types,
                    enums,
                    interfaces,
                    unions,
                    objects,
                },
            });
        }
        const { document, typesExcludedFromGeneration } = (0, make_document_to_augment_1.makeDocumentToAugment)(initialDocument);
        const { jwt } = typesExcludedFromGeneration;
        if (jwt) {
            this.jwtFieldsMap = jwt.jwtFieldsMap;
        }
        this.schemaModel = this.generateSchemaModel(document);
        const { nodes, relationships, typeDefs, resolvers } = (0, schema_1.makeAugmentedSchema)({
            document,
            features: this.features,
            userCustomResolvers: this.resolvers,
            subgraph,
            schemaModel: this.schemaModel,
            _experimental: this.experimental,
        });
        if (this.validate) {
            (0, schema_validation_1.validateUserDefinition)({
                userDocument: document,
                augmentedDocument: typeDefs,
                additionalDirectives: directives,
                additionalTypes: types,
                jwt: jwt?.type,
            });
        }
        this._nodes = nodes;
        this._relationships = relationships;
        // TODO: Move into makeAugmentedSchema, add resolvers alongside other resolvers
        const referenceResolvers = subgraph.getReferenceResolvers(this._nodes, this.schemaModel);
        const schema = subgraph.buildSchema({
            typeDefs,
            resolvers: (0, merge_1.mergeResolvers)([resolvers, referenceResolvers]),
        });
        return this.composeSchema(schema);
    }
    subscriptionMechanismSetup() {
        if (this.subscriptionInit) {
            return this.subscriptionInit;
        }
        const setup = async () => {
            const subscriptionsEngine = this.features?.subscriptions;
            if (subscriptionsEngine) {
                subscriptionsEngine.events.setMaxListeners(0); // Removes warning regarding leak. >10 listeners are expected
                if (subscriptionsEngine.init) {
                    if (!this.schemaModel)
                        throw new Error("SchemaModel not available on subscription mechanism");
                    await subscriptionsEngine.init({ schemaModel: this.schemaModel });
                }
            }
        };
        this.subscriptionInit = setup();
        return this.subscriptionInit;
    }
}
exports.default = Neo4jGraphQL;
//# sourceMappingURL=Neo4jGraphQL.js.map