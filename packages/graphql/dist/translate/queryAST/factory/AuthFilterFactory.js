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
exports.AuthFilterFactory = void 0;
const FilterFactory_1 = require("./FilterFactory");
const ParamPropertyFilter_1 = require("../ast/filters/property-filters/ParamPropertyFilter");
const AuthRelationshipFilter_1 = require("../ast/filters/authorization-filters/AuthRelationshipFilter");
const logical_operators_1 = require("../../utils/logical-operators");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const parse_where_field_1 = require("./parsers/parse-where-field");
const JWTFilter_1 = require("../ast/filters/authorization-filters/JWTFilter");
const PropertyFilter_1 = require("../ast/filters/property-filters/PropertyFilter");
const LogicalFilter_1 = require("../ast/filters/LogicalFilter");
class AuthFilterFactory extends FilterFactory_1.FilterFactory {
    // PopulatedWhere has the values as Cypher variables
    createAuthFilters({ entity, operations, context, populatedWhere, }) {
        const nestedFilters = Object.entries(populatedWhere).flatMap(([key, value]) => {
            if ((0, logical_operators_1.isLogicalOperator)(key)) {
                const nestedFilters = value.flatMap((v) => {
                    return this.createAuthFilters({
                        entity,
                        operations,
                        context,
                        populatedWhere: v,
                    });
                });
                return [
                    new LogicalFilter_1.LogicalFilter({
                        operation: key,
                        filters: nestedFilters,
                    }),
                ];
            }
            if (key === "node") {
                return this.createNodeFilters(entity, value);
            }
            else if (key === "jwt") {
                return this.createJWTFilters(context.authorization.jwtParam, value, context);
            }
            return [];
        });
        return nestedFilters;
    }
    createJWTFilters(jwtPayload, where, context) {
        return Object.entries(where).map(([key, value]) => {
            const { fieldName, operator } = (0, parse_where_field_1.parseWhereField)(key);
            if (!fieldName) {
                throw new Error(`Failed to find field name in filter: ${key}`);
            }
            if (!operator) {
                throw new Error(`Failed to find operator in filter: ${key}`);
            }
            const mappedJwtClaim = context.authorization.claims?.get(fieldName);
            let target = jwtPayload.property(fieldName);
            if (mappedJwtClaim) {
                // TODO: validate browser compatibility for Toolbox (https://caniuse.com/?search=Lookbehind)
                let paths = mappedJwtClaim.split(/(?<!\\)\./);
                paths = paths.map((p) => p.replaceAll(/\\\./g, "."));
                target = jwtPayload.property(...paths);
            }
            return new JWTFilter_1.JWTFilter({
                operator: operator || "EQ",
                JWTClaim: target,
                comparisonValue: value,
            });
        });
    }
    createPropertyFilter({ attribute, comparisonValue, operator, isNot, attachedTo, }) {
        const filterOperator = operator || "EQ";
        // This is probably not needed, but avoid changing the cypher
        if (typeof comparisonValue === "boolean") {
            return new ParamPropertyFilter_1.ParamPropertyFilter({
                attribute,
                comparisonValue: new cypher_builder_1.default.Param(comparisonValue),
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
        const isCypherVariable = comparisonValue instanceof cypher_builder_1.default.Variable ||
            comparisonValue instanceof cypher_builder_1.default.Property ||
            comparisonValue instanceof cypher_builder_1.default.Param;
        if (isCypherVariable) {
            return new ParamPropertyFilter_1.ParamPropertyFilter({
                attribute,
                comparisonValue: comparisonValue,
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
        else {
            return new PropertyFilter_1.PropertyFilter({
                attribute,
                comparisonValue: comparisonValue,
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
    }
    createRelationshipFilterTreeNode(options) {
        return new AuthRelationshipFilter_1.AuthRelationshipFilter(options);
    }
}
exports.AuthFilterFactory = AuthFilterFactory;
//# sourceMappingURL=AuthFilterFactory.js.map