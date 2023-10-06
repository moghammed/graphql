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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@neo4j/graphql");
const Model_1 = __importDefault(require("./Model"));
const filter_document_1 = require("../utils/filter-document");
class OGM {
    constructor(input) {
        const { typeDefs, database, ...rest } = input;
        this.models = [];
        this.database = database;
        this.neoSchema = new graphql_1.Neo4jGraphQL({
            ...rest,
            typeDefs: (0, filter_document_1.filterDocument)(typeDefs),
        });
        this.checkNeo4jCompat = function checkNeo4jCompat({ driver, sessionConfig, } = {}) {
            return this.neoSchema.checkNeo4jCompat({
                driver: driver || rest.driver,
                sessionConfig: sessionConfig || (database && { database }) || undefined,
            });
        };
        this.assertIndexesAndConstraints = async ({ driver, sessionConfig, options, } = {}) => {
            try {
                await this.neoSchema.assertIndexesAndConstraints({
                    options,
                    driver: driver || rest.driver,
                    sessionConfig: sessionConfig || (database && { database }) || undefined,
                });
            }
            catch (e) {
                if (e instanceof Error &&
                    e.message.includes("You must await `.getSchema()` before `.assertIndexesAndConstraints()`")) {
                    throw new Error("You must await `.init()` before `.assertIndexesAndConstraints()`");
                }
                throw e;
            }
        };
    }
    get schema() {
        if (!this._schema) {
            throw new Error("You must await `.init()` before accessing `schema`");
        }
        return this._schema;
    }
    async init() {
        if (!this.initializer) {
            this.initializer = this.createInitializer();
        }
        return this.initializer;
    }
    model(name) {
        let model = this.models.find((n) => n.name === name);
        if (model) {
            return model;
        }
        model = new Model_1.default(name, this.database);
        if (this._schema) {
            this.initModel(model);
        }
        this.models.push(model);
        return model;
    }
    get nodes() {
        try {
            return this.neoSchema["nodes"];
        }
        catch {
            throw new Error("You must await `.init()` before accessing `nodes`");
        }
    }
    initModel(model) {
        const node = this.neoSchema["nodes"].find((n) => n.name === model.name);
        if (!node) {
            throw new Error(`Could not find model ${model.name}`);
        }
        const selectionSet = `
                    {
                        ${[node.primitiveFields, node.scalarFields, node.enumFields, node.temporalFields].reduce((res, v) => [...res, ...v.map((x) => x.fieldName)], [])}
                    }
                `;
        model.init({
            schema: this.schema,
            selectionSet,
            namePluralized: node.plural,
            rootTypeFieldNames: node.rootTypeFieldNames,
        });
    }
    createInitializer() {
        return new Promise((resolve) => {
            this.neoSchema.getSchema().then((schema) => {
                this._schema = schema;
                this.models.forEach((model) => this.initModel(model));
                resolve();
            });
        });
    }
}
exports.default = OGM;
//# sourceMappingURL=OGM.js.map