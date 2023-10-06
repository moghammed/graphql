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
exports.findConflictingProperties = void 0;
const map_to_db_property_1 = __importDefault(require("./map-to-db-property"));
/* returns conflicting mutation input properties */
function findConflictingProperties({ node, input, }) {
    if (!input) {
        return [];
    }
    const dbPropertiesToInputFieldNames = Object.keys(input).reduce((acc, fieldName) => {
        const dbName = (0, map_to_db_property_1.default)(node, fieldName);
        // some input fields (eg relation fields) have no corresponding db name in the map
        if (!dbName) {
            return acc;
        }
        if (acc[dbName]) {
            acc[dbName].push(fieldName);
        }
        else {
            acc[dbName] = [fieldName];
        }
        return acc;
    }, {});
    return Object.values(dbPropertiesToInputFieldNames)
        .filter((v) => v.length > 1)
        .reduce((acc, el) => {
        acc.push(...el);
        return acc;
    }, []);
}
exports.findConflictingProperties = findConflictingProperties;
//# sourceMappingURL=is-property-clash.js.map