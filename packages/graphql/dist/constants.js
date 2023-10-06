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
exports.PROPAGATED_DIRECTIVES_FROM_SCHEMA_TO_OBJECT = exports.PROPAGATED_DIRECTIVES = exports.DEPRECATED = exports.INTERFACE_DIRECTIVES = exports.OBJECT_DIRECTIVES = exports.FIELD_DIRECTIVES = exports.DBMS_COMPONENTS_QUERY = exports.META_OLD_PROPS_CYPHER_VARIABLE = exports.META_CYPHER_VARIABLE = exports.RelationshipNestedOperationsOption = exports.RelationshipQueryDirectionOption = exports.WHERE_AGGREGATION_TYPES = exports.AGGREGATION_AGGREGATE_COUNT_OPERATORS = exports.AGGREGATION_COMPARISON_OPERATORS = exports.LOGICAL_OPERATORS = exports.NODE_OR_EDGE_KEYS = exports.isSpatial = exports.isTemporal = exports.SPATIAL_TYPES = exports.SCALAR_TYPES = exports.TEMPORAL_SCALAR_TYPES = exports.GRAPHQL_BUILTIN_SCALAR_TYPES = exports.RESERVED_INTERFACE_FIELDS = exports.RESERVED_TYPE_NAMES = exports.RELATIONSHIP_REQUIREMENT_PREFIX = exports.DEBUG_TRANSLATE = exports.DEBUG_GENERATE = exports.DEBUG_EXECUTE = exports.DEBUG_GRAPHQL = exports.DEBUG_AUTH = exports.DEBUG_ALL = exports.AUTHORIZATION_UNAUTHENTICATED = exports.REQUIRED_APOC_FUNCTIONS = exports.MIN_NEO4J_VERSION = exports.AUTH_UNAUTHENTICATED_ERROR = exports.AUTH_FORBIDDEN_ERROR = void 0;
const DEBUG_PREFIX = "@neo4j/graphql";
exports.AUTH_FORBIDDEN_ERROR = "@neo4j/graphql/FORBIDDEN";
exports.AUTH_UNAUTHENTICATED_ERROR = "@neo4j/graphql/UNAUTHENTICATED";
exports.MIN_NEO4J_VERSION = "4.4";
exports.REQUIRED_APOC_FUNCTIONS = ["apoc.util.validatePredicate", "apoc.date.convertFormat"];
exports.AUTHORIZATION_UNAUTHENTICATED = "Unauthenticated";
exports.DEBUG_ALL = `${DEBUG_PREFIX}:*`;
exports.DEBUG_AUTH = `${DEBUG_PREFIX}:auth`;
exports.DEBUG_GRAPHQL = `${DEBUG_PREFIX}:graphql`;
exports.DEBUG_EXECUTE = `${DEBUG_PREFIX}:execute`;
exports.DEBUG_GENERATE = `${DEBUG_PREFIX}:generate`;
exports.DEBUG_TRANSLATE = `${DEBUG_PREFIX}:translate`;
exports.RELATIONSHIP_REQUIREMENT_PREFIX = "@neo4j/graphql/RELATIONSHIP-REQUIRED";
exports.RESERVED_TYPE_NAMES = [
    {
        regex: /^PageInfo$/,
        error: "Type or Interface with name `PageInfo` reserved to support the pagination model of connections. See https://relay.dev/graphql/connections.htm#sec-Reserved-Types for more information.",
    },
    {
        regex: /^.+Connection$/,
        error: 'Type or Interface with name ending "Connection" are reserved to support the pagination model of connections. See https://relay.dev/graphql/connections.htm#sec-Reserved-Types for more information.',
    },
    {
        regex: /^Node$/,
        error: "Type or Interface with name `Node` reserved to support Relay. See https://relay.dev/graphql/ for more information.",
    },
];
// [0]Field [1]Error
exports.RESERVED_INTERFACE_FIELDS = [
    ["node", "Interface field name 'node' reserved to support relay See https://relay.dev/graphql/"],
    ["cursor", "Interface field name 'cursor' reserved to support relay See https://relay.dev/graphql/"],
];
exports.GRAPHQL_BUILTIN_SCALAR_TYPES = ["Boolean", "ID", "String", "Int", "Float"];
exports.TEMPORAL_SCALAR_TYPES = ["DateTime", "LocalDateTime", "Time", "LocalTime", "Date"];
exports.SCALAR_TYPES = [...exports.GRAPHQL_BUILTIN_SCALAR_TYPES, ...exports.TEMPORAL_SCALAR_TYPES, "BigInt", "Duration"];
exports.SPATIAL_TYPES = ["Point", "CartesianPoint"];
function isTemporal(typeName) {
    return exports.TEMPORAL_SCALAR_TYPES.includes(typeName);
}
exports.isTemporal = isTemporal;
function isSpatial(typeName) {
    return exports.SPATIAL_TYPES.includes(typeName);
}
exports.isSpatial = isSpatial;
exports.NODE_OR_EDGE_KEYS = ["node", "edge"];
exports.LOGICAL_OPERATORS = ["AND", "OR", "NOT"];
// aggregation
exports.AGGREGATION_COMPARISON_OPERATORS = ["EQUAL", "GT", "GTE", "LT", "LTE"];
exports.AGGREGATION_AGGREGATE_COUNT_OPERATORS = ["count", "count_LT", "count_LTE", "count_GT", "count_GTE"];
exports.WHERE_AGGREGATION_TYPES = [
    "ID",
    "String",
    "Float",
    "Int",
    "BigInt",
    "DateTime",
    "LocalDateTime",
    "LocalTime",
    "Time",
    "Duration",
];
var RelationshipQueryDirectionOption;
(function (RelationshipQueryDirectionOption) {
    RelationshipQueryDirectionOption["DEFAULT_DIRECTED"] = "DEFAULT_DIRECTED";
    RelationshipQueryDirectionOption["DEFAULT_UNDIRECTED"] = "DEFAULT_UNDIRECTED";
    RelationshipQueryDirectionOption["DIRECTED_ONLY"] = "DIRECTED_ONLY";
    RelationshipQueryDirectionOption["UNDIRECTED_ONLY"] = "UNDIRECTED_ONLY";
})(RelationshipQueryDirectionOption || (exports.RelationshipQueryDirectionOption = RelationshipQueryDirectionOption = {}));
var RelationshipNestedOperationsOption;
(function (RelationshipNestedOperationsOption) {
    RelationshipNestedOperationsOption["CREATE"] = "CREATE";
    RelationshipNestedOperationsOption["UPDATE"] = "UPDATE";
    RelationshipNestedOperationsOption["DELETE"] = "DELETE";
    RelationshipNestedOperationsOption["CONNECT"] = "CONNECT";
    RelationshipNestedOperationsOption["DISCONNECT"] = "DISCONNECT";
    RelationshipNestedOperationsOption["CONNECT_OR_CREATE"] = "CONNECT_OR_CREATE";
})(RelationshipNestedOperationsOption || (exports.RelationshipNestedOperationsOption = RelationshipNestedOperationsOption = {}));
exports.META_CYPHER_VARIABLE = "meta";
exports.META_OLD_PROPS_CYPHER_VARIABLE = "oldProps";
exports.DBMS_COMPONENTS_QUERY = "CALL dbms.components() YIELD versions, edition UNWIND versions AS version RETURN version, edition";
exports.FIELD_DIRECTIVES = [
    "alias",
    "authentication",
    "authorization",
    "coalesce",
    "customResolver",
    "cypher",
    "default",
    "filterable",
    "id",
    "jwtClaim",
    "populatedBy",
    "relationship",
    "relayId",
    "selectable",
    "settable",
    "subscriptionsAuthorization",
    "timestamp",
    "unique",
];
exports.OBJECT_DIRECTIVES = [
    "authentication",
    "authorization",
    "deprecated",
    "fulltext",
    "jwt",
    "mutation",
    "node",
    "plural",
    "query",
    "limit",
    "shareable",
    "subscription",
    "subscriptionsAuthorization",
];
exports.INTERFACE_DIRECTIVES = ["relationshipProperties"];
exports.DEPRECATED = "deprecated";
exports.PROPAGATED_DIRECTIVES = ["shareable", exports.DEPRECATED];
exports.PROPAGATED_DIRECTIVES_FROM_SCHEMA_TO_OBJECT = ["query", "mutation", "subscription"];
//# sourceMappingURL=constants.js.map