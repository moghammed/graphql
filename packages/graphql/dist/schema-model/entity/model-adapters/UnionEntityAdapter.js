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
exports.UnionEntityAdapter = void 0;
const string_manipulation_1 = require("../../utils/string-manipulation");
const ConcreteEntityAdapter_1 = require("./ConcreteEntityAdapter");
const UnionEntityOperations_1 = require("./UnionEntityOperations");
class UnionEntityAdapter {
    constructor(entity) {
        this.name = entity.name;
        this.concreteEntities = [];
        this.initConcreteEntities(entity.concreteEntities);
    }
    initConcreteEntities(entities) {
        for (const entity of entities) {
            const entityAdapter = new ConcreteEntityAdapter_1.ConcreteEntityAdapter(entity);
            this.concreteEntities.push(entityAdapter);
        }
    }
    get operations() {
        if (!this._operations) {
            return new UnionEntityOperations_1.UnionEntityOperations(this);
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
            this._plural = (0, string_manipulation_1.plural)(this.name);
        }
        return this._plural;
    }
}
exports.UnionEntityAdapter = UnionEntityAdapter;
//# sourceMappingURL=UnionEntityAdapter.js.map