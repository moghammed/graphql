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
exports.SortAndPaginationFactory = void 0;
const Pagination_1 = require("../ast/pagination/Pagination");
const CypherPropertySort_1 = require("../ast/sort/CypherPropertySort");
const PropertySort_1 = require("../ast/sort/PropertySort");
const is_union_entity_1 = require("../utils/is-union-entity");
class SortAndPaginationFactory {
    createSortFields(options, entity) {
        return (options.sort || [])?.flatMap((s) => this.createPropertySort(s, entity));
    }
    createConnectionSortFields(options, relationship) {
        const nodeSortFields = this.createPropertySort(options.node || {}, relationship.target);
        const edgeSortFields = this.createPropertySort(options.edge || {}, relationship);
        return {
            edge: edgeSortFields,
            node: nodeSortFields,
        };
    }
    createPagination(options) {
        if (options.limit || options.offset) {
            return new Pagination_1.Pagination({
                skip: options.offset,
                limit: options.limit,
            });
        }
    }
    createPropertySort(optionArg, entity) {
        if ((0, is_union_entity_1.isUnionEntity)(entity)) {
            return [];
        }
        return Object.entries(optionArg).map(([fieldName, sortDir]) => {
            const attribute = entity.findAttribute(fieldName);
            if (!attribute)
                throw new Error(`no filter attribute ${fieldName}`);
            if (attribute.annotations.cypher) {
                return new CypherPropertySort_1.CypherPropertySort({
                    direction: sortDir,
                    attribute,
                });
            }
            return new PropertySort_1.PropertySort({
                direction: sortDir,
                attribute,
            });
        });
    }
}
exports.SortAndPaginationFactory = SortAndPaginationFactory;
//# sourceMappingURL=SortAndPaginationFactory.js.map