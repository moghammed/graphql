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
exports.filterByValues = void 0;
const get_filtering_fn_1 = require("../../../schema/resolvers/subscriptions/where/utils/get-filtering-fn");
const multiple_conditions_aggregation_map_1 = require("../../../schema/resolvers/subscriptions/where/utils/multiple-conditions-aggregation-map");
const parse_filter_property_1 = require("../../../schema/resolvers/subscriptions/where/utils/parse-filter-property");
function filterByValues(whereInput, receivedValues) {
    for (const [k, v] of Object.entries(whereInput)) {
        if (Object.keys(multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap).includes(k)) {
            const comparisonResultsAggregationFn = multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap[k];
            let comparisonResults;
            if (k === "NOT") {
                comparisonResults = filterByValues(v, receivedValues);
            }
            else {
                comparisonResults = v.map((whereCl) => {
                    return filterByValues(whereCl, receivedValues);
                });
            }
            if (!comparisonResultsAggregationFn(comparisonResults)) {
                return false;
            }
        }
        else {
            const { fieldName, operator } = (0, parse_filter_property_1.parseFilterProperty)(k);
            const receivedValue = receivedValues[fieldName];
            if (!receivedValue) {
                return false;
            }
            const checkFilterPasses = (0, get_filtering_fn_1.getFilteringFn)(operator);
            if (!checkFilterPasses(receivedValue, v)) {
                return false;
            }
        }
    }
    return true;
}
exports.filterByValues = filterByValues;
//# sourceMappingURL=filter-by-values.js.map