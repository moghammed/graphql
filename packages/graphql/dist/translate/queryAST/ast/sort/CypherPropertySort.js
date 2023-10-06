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
exports.CypherPropertySort = void 0;
const Sort_1 = require("./Sort");
const CypherAnnotationSubqueryGenerator_1 = require("../../cypher-generators/CypherAnnotationSubqueryGenerator");
class CypherPropertySort extends Sort_1.Sort {
    constructor({ attribute, direction }) {
        super();
        this.attribute = attribute;
        this.direction = direction;
    }
    getChildren() {
        return [];
    }
    print() {
        return `${super.print()} <${this.attribute.name}>`;
    }
    getSortFields(context, variable, sortByDatabaseName = true) {
        const isNested = context.source;
        if (isNested) {
            const attributeName = sortByDatabaseName ? this.attribute.databaseName : this.attribute.name;
            const nodeProperty = variable.property(attributeName);
            return [[nodeProperty, this.direction]];
        }
        const projectionVar = context.getScopeVariable(this.attribute.name);
        return [[projectionVar, this.direction]];
    }
    getProjectionField(context) {
        const projectionVar = context.getScopeVariable(this.attribute.name);
        return {
            [this.attribute.databaseName]: projectionVar,
        };
    }
    getSubqueries(context) {
        const scope = context.getTargetScope();
        if (scope.has(this.attribute.name)) {
            return [];
        }
        const cypherGenerator = new CypherAnnotationSubqueryGenerator_1.CypherAnnotationSubqueryGenerator({
            context,
            attribute: this.attribute,
        });
        const subquery = cypherGenerator.createSubqueryForCypherAnnotation({});
        return [subquery];
    }
}
exports.CypherPropertySort = CypherPropertySort;
//# sourceMappingURL=CypherPropertySort.js.map