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
const create_where_and_params_1 = __importDefault(require("./where/create-where-and-params"));
const create_set_relationship_properties_and_params_1 = __importDefault(require("./create-set-relationship-properties-and-params"));
const create_relationship_validation_string_1 = __importDefault(require("./create-relationship-validation-string"));
const create_connection_event_meta_1 = require("./subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("./subscriptions/filter-meta-variable");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const case_where_1 = require("../utils/case-where");
const create_authorization_before_and_params_1 = require("./authorization/compatibility/create-authorization-before-and-params");
const create_authorization_after_and_params_1 = require("./authorization/compatibility/create-authorization-after-and-params");
const check_authentication_1 = require("./authorization/check-authentication");
function createConnectAndParams({ withVars, value, varName, relationField, parentVar, refNodes, context, callbackBucket, labelOverride, parentNode, includeRelationshipValidation, isFirstLevel = true, source, }) {
    (0, check_authentication_1.checkAuthentication)({ context, node: parentNode, targetOperations: ["CREATE_RELATIONSHIP"] });
    function createSubqueryContents(relatedNode, connect, index) {
        (0, check_authentication_1.checkAuthentication)({ context, node: relatedNode, targetOperations: ["CREATE_RELATIONSHIP"] });
        let params = {};
        const baseName = `${varName}${index}`;
        const nodeName = `${baseName}_node`;
        const relationshipName = `${baseName}_relationship`;
        const inStr = relationField.direction === "IN" ? "<-" : "-";
        const outStr = relationField.direction === "OUT" ? "->" : "-";
        const relTypeStr = `[${relationField.properties || context.subscriptionsEnabled ? relationshipName : ""}:${relationField.type}]`;
        const isOverwriteNotAllowed = connect.overwrite === false;
        const subquery = [];
        const labels = relatedNode.getLabelString(context);
        const label = labelOverride ? `:${labelOverride}` : labels;
        subquery.push(`\tWITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}`);
        if (context.subscriptionsEnabled) {
            const innerMetaStr = `, [] as meta`;
            subquery.push(`\tWITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}${innerMetaStr}`);
        }
        subquery.push(`\tOPTIONAL MATCH (${nodeName}${label})`);
        const whereStrs = [];
        let aggregationWhere = false;
        if (connect.where) {
            // If _on is the only where key and it doesn't contain this implementation, don't connect it
            if (connect.where.node._on &&
                Object.keys(connect.where.node).length === 1 &&
                !Object.prototype.hasOwnProperty.call(connect.where.node._on, relatedNode.name)) {
                return { subquery: "", params: {} };
            }
            const [rootNodeWhereCypher, preComputedSubqueries, rootNodeWhereParams] = (0, create_where_and_params_1.default)({
                whereInput: {
                    ...Object.entries(connect.where.node).reduce((args, [k, v]) => {
                        if (k !== "_on") {
                            // If this where key is also inside _on for this implementation, use the one in _on instead
                            if (connect.where.node?._on?.[relatedNode.name]?.[k]) {
                                return args;
                            }
                            return { ...args, [k]: v };
                        }
                        return args;
                    }, {}),
                },
                context,
                node: relatedNode,
                varName: nodeName,
                recursing: true,
            });
            if (rootNodeWhereCypher) {
                whereStrs.push(rootNodeWhereCypher);
                params = { ...params, ...rootNodeWhereParams };
                if (preComputedSubqueries) {
                    subquery.push(preComputedSubqueries);
                    aggregationWhere = true;
                }
            }
            // For _on filters
            if (connect.where.node?._on?.[relatedNode.name]) {
                const [onTypeNodeWhereCypher, preComputedSubqueries, onTypeNodeWhereParams] = (0, create_where_and_params_1.default)({
                    whereInput: {
                        ...Object.entries(connect.where.node).reduce((args, [k, v]) => {
                            if (k !== "_on") {
                                return { ...args, [k]: v };
                            }
                            if (Object.prototype.hasOwnProperty.call(v, relatedNode.name)) {
                                return { ...args, ...v[relatedNode.name] };
                            }
                            return args;
                        }, {}),
                    },
                    context,
                    node: relatedNode,
                    varName: `${nodeName}`,
                    chainStr: `${nodeName}_on_${relatedNode.name}`,
                    recursing: true,
                });
                if (onTypeNodeWhereCypher) {
                    whereStrs.push(onTypeNodeWhereCypher);
                    params = { ...params, ...onTypeNodeWhereParams };
                    if (preComputedSubqueries) {
                        subquery.push(preComputedSubqueries);
                        aggregationWhere = true;
                    }
                }
            }
        }
        const authorizationNodes = [{ node: relatedNode, variable: nodeName }];
        // If the source is a create operation, it is likely that authorization
        // rules are not satisfied until connect operation is complete
        if (source !== "CREATE") {
            authorizationNodes.push({ node: parentNode, variable: parentVar });
        }
        const authorizationBeforeAndParams = (0, create_authorization_before_and_params_1.createAuthorizationBeforeAndParams)({
            context,
            nodes: authorizationNodes,
            operations: ["CREATE_RELATIONSHIP"],
        });
        if (authorizationBeforeAndParams) {
            const { cypher, params: authWhereParams, subqueries } = authorizationBeforeAndParams;
            whereStrs.push(cypher);
            params = { ...params, ...authWhereParams };
            if (subqueries) {
                subquery.push(subqueries);
            }
        }
        if (whereStrs.length) {
            const predicate = `${whereStrs.join(" AND ")}`;
            if (aggregationWhere) {
                const columns = [new cypher_builder_1.default.NamedVariable(nodeName)];
                const caseWhereClause = (0, case_where_1.caseWhere)(new cypher_builder_1.default.RawCypher(predicate), columns);
                const { cypher } = caseWhereClause.build("aggregateWhereFilter");
                subquery.push(cypher);
            }
            else {
                subquery.push(`\tWHERE ${predicate}`);
            }
        }
        /*
           TODO
           Replace with subclauses https://neo4j.com/developer/kb/conditional-cypher-execution/
           https://neo4j.slack.com/archives/C02PUHA7C/p1603458561099100
        */
        subquery.push("\tCALL {");
        subquery.push("\t\tWITH *");
        const withVarsInner = [
            ...withVars.filter((v) => v !== parentVar),
            `collect(${nodeName}) as connectedNodes`,
            `collect(${parentVar}) as parentNodes`,
        ];
        if (context.subscriptionsEnabled) {
            withVarsInner.push(`[] as meta`);
        }
        subquery.push(`\t\tWITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVarsInner).join(", ")}`);
        subquery.push("\t\tCALL {"); //
        subquery.push("\t\t\tWITH connectedNodes, parentNodes"); //
        subquery.push(`\t\t\tUNWIND parentNodes as ${parentVar}`);
        subquery.push(`\t\t\tUNWIND connectedNodes as ${nodeName}`);
        const connectOperator = isOverwriteNotAllowed ? "CREATE" : "MERGE";
        subquery.push(`\t\t\t${connectOperator} (${parentVar})${inStr}${relTypeStr}${outStr}(${nodeName})`);
        if (relationField.properties) {
            const relationship = context.relationships.find((x) => x.properties === relationField.properties);
            const setA = (0, create_set_relationship_properties_and_params_1.default)({
                properties: connect.edge ?? {},
                varName: relationshipName,
                relationship,
                operation: "CREATE",
                callbackBucket,
            });
            subquery.push(`\t\t\t${setA[0]}`);
            params = { ...params, ...setA[1] };
        }
        if (context.subscriptionsEnabled) {
            const [fromVariable, toVariable] = relationField.direction === "IN" ? [nodeName, parentVar] : [parentVar, nodeName];
            const [fromTypename, toTypename] = relationField.direction === "IN"
                ? [relatedNode.name, parentNode.name]
                : [parentNode.name, relatedNode.name];
            const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMetaObject)({
                event: "create_relationship",
                relVariable: relationshipName,
                fromVariable,
                toVariable,
                typename: relationField.typeUnescaped,
                fromTypename,
                toTypename,
            });
            subquery.push(`\t\t\tWITH ${eventWithMetaStr} as meta`);
            subquery.push(`\t\t\tRETURN collect(meta) as update_meta`);
        }
        subquery.push("\t\t}");
        if (context.subscriptionsEnabled) {
            subquery.push(`\t\tWITH meta + update_meta as meta`);
            subquery.push(`\t\tRETURN meta AS connect_meta`);
        }
        subquery.push("\t}");
        let innerMetaStr = "";
        if (context.subscriptionsEnabled) {
            innerMetaStr = `, connect_meta + meta AS meta`;
        }
        if (includeRelationshipValidation || isOverwriteNotAllowed) {
            const relValidationStrs = [];
            const matrixItems = [
                [parentNode, parentVar],
                [relatedNode, nodeName],
            ];
            matrixItems.forEach((mi) => {
                const relValidationStr = (0, create_relationship_validation_string_1.default)({
                    node: mi[0],
                    context,
                    varName: mi[1],
                    ...(isOverwriteNotAllowed && { relationshipFieldNotOverwritable: relationField.fieldName }),
                });
                if (relValidationStr) {
                    relValidationStrs.push(relValidationStr);
                }
            });
            if (relValidationStrs.length) {
                subquery.push(`\tWITH ${[...(0, filter_meta_variable_1.filterMetaVariable)(withVars), nodeName].join(", ")}${innerMetaStr}`);
                subquery.push(relValidationStrs.join("\n"));
                if (context.subscriptionsEnabled) {
                    innerMetaStr = ", meta";
                }
            }
        }
        subquery.push(`WITH ${[...(0, filter_meta_variable_1.filterMetaVariable)(withVars), nodeName].join(", ")}${innerMetaStr}`);
        if (connect.connect) {
            const connects = (Array.isArray(connect.connect) ? connect.connect : [connect.connect]);
            connects.forEach((c) => {
                const reduced = Object.entries(c)
                    .filter(([k]) => {
                    if (k === "_on") {
                        return false;
                    }
                    if (relationField.interface && c?._on?.[relatedNode.name]) {
                        const onArray = Array.isArray(c._on[relatedNode.name])
                            ? c._on[relatedNode.name]
                            : [c._on[relatedNode.name]];
                        if (onArray.some((onKey) => Object.prototype.hasOwnProperty.call(onKey, k))) {
                            return false;
                        }
                    }
                    return true;
                })
                    .reduce((r, [k, v]) => {
                    const relField = relatedNode.relationFields.find((x) => k === x.fieldName);
                    const newRefNodes = [];
                    if (relField.union) {
                        Object.keys(v).forEach((modelName) => {
                            newRefNodes.push(context.nodes.find((x) => x.name === modelName));
                        });
                    }
                    else if (relField.interface) {
                        relField.interface.implementations.forEach((modelName) => {
                            newRefNodes.push(context.nodes.find((x) => x.name === modelName));
                        });
                    }
                    else {
                        newRefNodes.push(context.nodes.find((x) => x.name === relField.typeMeta.name));
                    }
                    newRefNodes.forEach((newRefNode) => {
                        const recurse = createConnectAndParams({
                            withVars: [...withVars, nodeName],
                            value: relField.union ? v[newRefNode.name] : v,
                            varName: `${nodeName}_${k}${relField.union ? `_${newRefNode.name}` : ""}`,
                            relationField: relField,
                            parentVar: nodeName,
                            context,
                            callbackBucket,
                            refNodes: [newRefNode],
                            parentNode: relatedNode,
                            labelOverride: relField.union ? newRefNode.name : "",
                            includeRelationshipValidation: true,
                            isFirstLevel: false,
                            source: "CONNECT",
                        });
                        r.connects.push(recurse[0]);
                        r.params = { ...r.params, ...recurse[1] };
                    });
                    return r;
                }, { connects: [], params: {} });
                subquery.push(reduced.connects.join("\n"));
                params = { ...params, ...reduced.params };
                if (relationField.interface && c?._on?.[relatedNode.name]) {
                    const onConnects = Array.isArray(c._on[relatedNode.name])
                        ? c._on[relatedNode.name]
                        : [c._on[relatedNode.name]];
                    onConnects.forEach((onConnect, onConnectIndex) => {
                        const onReduced = Object.entries(onConnect).reduce((r, [k, v]) => {
                            const relField = relatedNode.relationFields.find((x) => k.startsWith(x.fieldName));
                            const newRefNodes = [];
                            if (relField.union) {
                                Object.keys(v).forEach((modelName) => {
                                    newRefNodes.push(context.nodes.find((x) => x.name === modelName));
                                });
                            }
                            else {
                                newRefNodes.push(context.nodes.find((x) => x.name === relField.typeMeta.name));
                            }
                            newRefNodes.forEach((newRefNode) => {
                                const recurse = createConnectAndParams({
                                    withVars: [...withVars, nodeName],
                                    value: relField.union ? v[newRefNode.name] : v,
                                    varName: `${nodeName}_on_${relatedNode.name}${onConnectIndex}_${k}`,
                                    relationField: relField,
                                    parentVar: nodeName,
                                    context,
                                    callbackBucket,
                                    refNodes: [newRefNode],
                                    parentNode: relatedNode,
                                    labelOverride: relField.union ? newRefNode.name : "",
                                    isFirstLevel: false,
                                    source: "CONNECT",
                                });
                                r.connects.push(recurse[0]);
                                r.params = { ...r.params, ...recurse[1] };
                            });
                            return r;
                        }, { connects: [], params: {} });
                        subquery.push(onReduced.connects.join("\n"));
                        params = { ...params, ...onReduced.params };
                    });
                }
            });
        }
        const authorizationAfterAndParams = (0, create_authorization_after_and_params_1.createAuthorizationAfterAndParams)({
            context,
            nodes: [
                { node: parentNode, variable: parentVar },
                { node: relatedNode, variable: nodeName },
            ],
            operations: ["CREATE_RELATIONSHIP"],
        });
        if (authorizationAfterAndParams) {
            const { cypher, params: authWhereParams, subqueries } = authorizationAfterAndParams;
            if (cypher) {
                if (subqueries) {
                    subquery.push(`WITH *`);
                    subquery.push(`${subqueries}`);
                    subquery.push(`WITH *`);
                }
                else {
                    subquery.push(`WITH ${[...withVars, nodeName].join(", ")}`);
                }
                subquery.push(`WHERE ${cypher}`);
                params = { ...params, ...authWhereParams };
            }
        }
        if (context.subscriptionsEnabled) {
            subquery.push(`WITH collect(meta) AS connect_meta`);
            subquery.push(`RETURN REDUCE(m=[],m1 IN connect_meta | m+m1 ) as connect_meta`);
        }
        else {
            subquery.push(`\tRETURN count(*) AS connect_${varName}_${relatedNode.name}${index}`);
        }
        return { subquery: subquery.join("\n"), params };
    }
    function reducer(res, connect, index) {
        if (isFirstLevel) {
            res.connects.push(`WITH *`);
        }
        const inner = [];
        if (relationField.interface) {
            const subqueries = [];
            refNodes.forEach((refNode, i) => {
                const subquery = createSubqueryContents(refNode, connect, i);
                if (subquery.subquery) {
                    subqueries.push(subquery.subquery);
                    res.params = { ...res.params, ...subquery.params };
                }
            });
            if (subqueries.length > 0) {
                if (context.subscriptionsEnabled) {
                    const withStatement = `WITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}, connect_meta + meta AS meta`;
                    inner.push(subqueries.join(`\n}\n${withStatement}\nCALL {\n\t`));
                }
                else {
                    inner.push(subqueries.join("\n}\nCALL {\n\t"));
                }
            }
        }
        else {
            const subquery = createSubqueryContents(refNodes[0], connect, index);
            inner.push(subquery.subquery);
            res.params = { ...res.params, ...subquery.params };
        }
        if (inner.length > 0) {
            res.connects.push("CALL {");
            res.connects.push(...inner);
            res.connects.push("}");
            if (context.subscriptionsEnabled) {
                res.connects.push(`WITH connect_meta + meta AS meta, ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}`);
            }
        }
        return res;
    }
    const { connects, params } = (relationField.typeMeta.array ? value : [value]).reduce(reducer, {
        connects: [],
        params: {},
    });
    return [connects.join("\n"), params];
}
exports.default = createConnectAndParams;
//# sourceMappingURL=create-connect-and-params.js.map