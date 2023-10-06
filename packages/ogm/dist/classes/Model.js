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
const graphql_1 = require("graphql");
function printSelectionSet(selectionSet) {
    if (typeof selectionSet === "string") {
        return (0, graphql_1.print)((0, graphql_1.parse)(selectionSet));
    }
    return (0, graphql_1.print)(selectionSet);
}
class Model {
    constructor(name, database) {
        this.name = name;
        this.database = database;
    }
    set selectionSet(selectionSet) {
        this._selectionSet = printSelectionSet(selectionSet);
    }
    get namePluralized() {
        if (!this._namePluralized) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        return this._namePluralized;
    }
    get rootTypeFieldNames() {
        if (!this._rootTypeFieldNames) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        return this._rootTypeFieldNames;
    }
    init({ schema, selectionSet, namePluralized, rootTypeFieldNames, }) {
        this.selectionSet = selectionSet;
        this.schema = schema;
        this._namePluralized = namePluralized;
        this._rootTypeFieldNames = rootTypeFieldNames;
    }
    async find({ where, fulltext, options, selectionSet, args = {}, context = {}, rootValue = null, } = {}) {
        if (!this.schema) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        const argWorthy = Boolean(where || options || fulltext);
        const argDefinitions = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `$where: ${this.name}Where` : ""}`,
            `${options ? `$options: ${this.name}Options` : ""}`,
            `${fulltext ? `$fulltext: ${this.name}Fulltext` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const argsApply = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `where: $where` : ""}`,
            `${options ? `options: $options` : ""}`,
            `${fulltext ? `fulltext: $fulltext` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const validSelectionSet = this.getSelectionSetOrDefault(selectionSet);
        const selection = printSelectionSet(validSelectionSet);
        const query = `
            query ${argDefinitions.join(" ")}{
                ${this.rootTypeFieldNames.read}${argsApply.join(" ")} ${selection}
            }
        `;
        const variableValues = { where, options, fulltext, ...args };
        const result = await (0, graphql_1.graphql)({
            schema: this.schema,
            source: query,
            rootValue,
            contextValue: { sessionConfig: { database: this.database }, ...context },
            variableValues,
        });
        if (result.errors?.length) {
            throw new Error(result.errors[0].message);
        }
        return result.data[this.namePluralized];
    }
    async create({ input, selectionSet, args = {}, context = {}, rootValue = null, } = {}) {
        if (!this.schema) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        const mutationName = this.rootTypeFieldNames.create;
        let selection = "";
        if (selectionSet) {
            selection = printSelectionSet(selectionSet);
        }
        else {
            const validSelectionSet = this.getSelectionSetOrDefault(selectionSet);
            selection = `
               {
                   ${this.namePluralized}
                   ${printSelectionSet(validSelectionSet)}
               }
           `;
        }
        const mutation = `
            mutation ($input: [${this.name}CreateInput!]!){
               ${mutationName}(input: $input) ${selection}
            }
        `;
        const variableValues = { ...args, input };
        const result = await (0, graphql_1.graphql)({
            schema: this.schema,
            source: mutation,
            rootValue,
            contextValue: { sessionConfig: { database: this.database }, ...context },
            variableValues,
        });
        if (result.errors?.length) {
            throw new Error(result.errors[0].message);
        }
        return result.data[mutationName];
    }
    async update({ where, update, connect, disconnect, create, connectOrCreate, selectionSet, args = {}, context = {}, rootValue = null, } = {}) {
        if (!this.schema) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        const mutationName = this.rootTypeFieldNames.update;
        const argWorthy = Boolean(where || update || connect || disconnect || create || connectOrCreate);
        let selection = "";
        if (selectionSet) {
            selection = printSelectionSet(selectionSet);
        }
        else {
            const validSelectionSet = this.getSelectionSetOrDefault(selectionSet);
            selection = `
               {
                   ${this.namePluralized}
                   ${printSelectionSet(validSelectionSet)}
               }
           `;
        }
        const argDefinitions = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `$where: ${this.name}Where` : ""}`,
            `${update ? `$update: ${this.name}UpdateInput` : ""}`,
            `${connect ? `$connect: ${this.name}ConnectInput` : ""}`,
            `${disconnect ? `$disconnect: ${this.name}DisconnectInput` : ""}`,
            `${connectOrCreate ? `$connectOrCreate: ${this.name}ConnectOrCreateInput` : ""}`,
            `${create ? `$create: ${this.name}RelationInput` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const argsApply = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `where: $where` : ""}`,
            `${update ? `update: $update` : ""}`,
            `${connect ? `connect: $connect` : ""}`,
            `${disconnect ? `disconnect: $disconnect` : ""}`,
            `${connectOrCreate ? `connectOrCreate: $connectOrCreate` : ""}`,
            `${create ? `create: $create` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const mutation = `
            mutation ${argDefinitions.join(" ")}{
               ${mutationName}${argsApply.join(" ")}
               ${selection}
            }
        `;
        const variableValues = { ...args, where, update, connect, disconnect, create, connectOrCreate };
        const result = await (0, graphql_1.graphql)({
            schema: this.schema,
            source: mutation,
            rootValue,
            contextValue: { sessionConfig: { database: this.database }, ...context },
            variableValues,
        });
        if (result.errors?.length) {
            throw new Error(result.errors[0].message);
        }
        return result.data[mutationName];
    }
    async delete({ where, delete: deleteInput, context = {}, rootValue = null, } = {}) {
        if (!this.schema) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        const mutationName = this.rootTypeFieldNames.delete;
        const argWorthy = where || deleteInput;
        const argDefinitions = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `$where: ${this.name}Where` : ""}`,
            `${deleteInput ? `$delete: ${this.name}DeleteInput` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const argsApply = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `where: $where` : ""}`,
            `${deleteInput ? `delete: $delete` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const mutation = `
            mutation ${argDefinitions.join(" ")}{
               ${mutationName}${argsApply.join(" ")} {
                   nodesDeleted
                   relationshipsDeleted
               }
            }
        `;
        const variableValues = { where, delete: deleteInput };
        const result = await (0, graphql_1.graphql)({
            schema: this.schema,
            source: mutation,
            rootValue,
            contextValue: { sessionConfig: { database: this.database }, ...context },
            variableValues,
        });
        if (result.errors?.length) {
            throw new Error(result.errors[0].message);
        }
        return result.data[mutationName];
    }
    async aggregate({ where, fulltext, aggregate, context = {}, rootValue = null, }) {
        if (!this.schema) {
            throw new Error("Must execute `OGM.init()` method before using Model instances");
        }
        const queryName = this.rootTypeFieldNames.aggregate;
        const selections = [];
        const argWorthy = Boolean(where || fulltext);
        const argDefinitions = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `$where: ${this.name}Where` : ""}`,
            `${fulltext ? `$fulltext: ${this.name}Fulltext` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        const argsApply = [
            `${argWorthy ? "(" : ""}`,
            `${where ? `where: $where` : ""}`,
            `${fulltext ? `fulltext: $fulltext` : ""}`,
            `${argWorthy ? ")" : ""}`,
        ];
        Object.entries(aggregate).forEach((entry) => {
            if (entry[0] === "count") {
                selections.push(entry[0]);
                return;
            }
            const thisSelections = [];
            Object.entries(entry[1]).forEach((e) => {
                if (Boolean(e[1]) === false) {
                    return;
                }
                thisSelections.push(e[0]);
            });
            if (thisSelections.length) {
                selections.push(`${entry[0]} {\n`);
                selections.push(thisSelections.join("\n"));
                selections.push(`}\n`);
            }
        });
        const query = `
            query ${argDefinitions.join(" ")}{
               ${queryName}${argsApply.join(" ")} {
                   ${selections.join("\n")}
               }
            }
        `;
        const variableValues = { where };
        const result = await (0, graphql_1.graphql)({
            schema: this.schema,
            source: query,
            rootValue,
            contextValue: { sessionConfig: { database: this.database }, ...context },
            variableValues,
        });
        if (result.errors?.length) {
            throw new Error(result.errors[0].message);
        }
        return result.data[queryName];
    }
    getSelectionSetOrDefault(selectionSet) {
        const result = selectionSet || this._selectionSet;
        if (!result) {
            throw new Error("Non defined selectionSet in ogm model");
        }
        return result;
    }
}
exports.default = Model;
//# sourceMappingURL=Model.js.map