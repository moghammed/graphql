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
exports.AggregationAttributeField = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const AggregationField_1 = require("./AggregationField");
class AggregationAttributeField extends AggregationField_1.AggregationField {
    constructor({ alias, attribute }) {
        super(alias);
        this.attribute = attribute;
    }
    getChildren() {
        return [];
    }
    getProjectionField(variable) {
        return { [this.alias]: variable };
    }
    getAggregationExpr(variable) {
        return cypher_builder_1.default.count(variable);
    }
    getAggregationProjection(target, returnVar) {
        if (this.attribute.typeHelper.isString()) {
            const aggrProp = target.property(this.attribute.databaseName);
            const listVar = new cypher_builder_1.default.NamedVariable("list");
            return new cypher_builder_1.default.With(target)
                .orderBy([cypher_builder_1.default.size(aggrProp), "DESC"])
                .with([cypher_builder_1.default.collect(aggrProp), listVar])
                .return([
                new cypher_builder_1.default.Map({
                    longest: cypher_builder_1.default.head(listVar),
                    shortest: cypher_builder_1.default.last(listVar),
                }),
                returnVar,
            ]);
        }
        if (this.attribute.typeHelper.isInt() || this.attribute.typeHelper.isFloat()) {
            const aggrProp = target.property(this.attribute.databaseName);
            return new cypher_builder_1.default.Return([
                new cypher_builder_1.default.Map({
                    min: cypher_builder_1.default.min(aggrProp),
                    max: cypher_builder_1.default.max(aggrProp),
                    average: cypher_builder_1.default.avg(aggrProp),
                    sum: cypher_builder_1.default.sum(aggrProp),
                }),
                returnVar,
            ]);
        }
        if (this.attribute.typeHelper.isDateTime()) {
            const aggrProp = target.property(this.attribute.databaseName);
            return new cypher_builder_1.default.Return([
                new cypher_builder_1.default.Map({
                    min: this.createDatetimeProjection(cypher_builder_1.default.min(aggrProp)),
                    max: this.createDatetimeProjection(cypher_builder_1.default.max(aggrProp)),
                }),
                returnVar,
            ]);
        }
        throw new Error(`Invalid aggregation type ${this.attribute.type.name}`);
    }
    createDatetimeProjection(expr) {
        return cypher_builder_1.default.apoc.date.convertFormat(expr, // TODO: any due to a problem in CB types
        "iso_zoned_date_time", "iso_offset_date_time");
    }
}
exports.AggregationAttributeField = AggregationAttributeField;
//# sourceMappingURL=AggregationAttributeField.js.map