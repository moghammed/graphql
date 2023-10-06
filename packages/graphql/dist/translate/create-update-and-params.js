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
const pluralize_1 = __importDefault(require("pluralize"));
const classes_1 = require("../classes");
const create_connect_and_params_1 = __importDefault(require("./create-connect-and-params"));
const create_disconnect_and_params_1 = __importDefault(require("./create-disconnect-and-params"));
const create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
const constants_1 = require("../constants");
const create_delete_and_params_1 = __importDefault(require("./create-delete-and-params"));
const create_set_relationship_properties_1 = __importDefault(require("./create-set-relationship-properties"));
const create_connection_where_and_params_1 = __importDefault(require("./where/create-connection-where-and-params"));
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const create_connect_or_create_and_params_1 = require("./create-connect-or-create-and-params");
const create_relationship_validation_string_1 = __importDefault(require("./create-relationship-validation-string"));
const create_event_meta_1 = require("./subscriptions/create-event-meta");
const create_connection_event_meta_1 = require("./subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("./subscriptions/filter-meta-variable");
const callback_utils_1 = require("./utils/callback-utils");
const math_1 = require("./utils/math");
const indent_block_1 = require("./utils/indent-block");
const wrap_string_in_apostrophes_1 = require("../utils/wrap-string-in-apostrophes");
const is_property_clash_1 = require("../utils/is-property-clash");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const case_where_1 = require("../utils/case-where");
const create_authorization_before_and_params_1 = require("./authorization/compatibility/create-authorization-before-and-params");
const create_authorization_after_and_params_1 = require("./authorization/compatibility/create-authorization-after-and-params");
const check_authentication_1 = require("./authorization/check-authentication");
const get_authorization_statements_1 = require("./utils/get-authorization-statements");
function createUpdateAndParams({ updateInput, varName, node, parentVar, chainStr, withVars, context, callbackBucket, parameterPrefix, includeRelationshipValidation, }) {
    let hasAppliedTimeStamps = false;
    const conflictingProperties = (0, is_property_clash_1.findConflictingProperties)({ node, input: updateInput });
    if (conflictingProperties.length > 0) {
        throw new classes_1.Neo4jGraphQLError(`Conflicting modification of ${conflictingProperties.map((n) => `[[${n}]]`).join(", ")} on type ${node.name}`);
    }
    (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["UPDATE"] });
    function reducer(res, [key, value]) {
        let param;
        if (chainStr) {
            param = `${chainStr}_${key}`;
        }
        else {
            param = `${parentVar}_update_${key}`;
        }
        const relationField = node.relationFields.find((x) => key === x.fieldName);
        const pointField = node.pointFields.find((x) => key === x.fieldName);
        const dbFieldName = (0, map_to_db_property_1.default)(node, key);
        if (relationField) {
            const refNodes = [];
            const relationship = context.relationships.find((x) => x.properties === relationField.properties);
            if (relationField.union) {
                Object.keys(value).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            const inStr = relationField.direction === "IN" ? "<-" : "-";
            const outStr = relationField.direction === "OUT" ? "->" : "-";
            const subqueries = [];
            const intermediateWithMetaStatements = [];
            refNodes.forEach((refNode, idx) => {
                const v = relationField.union ? value[refNode.name] : value;
                const updates = relationField.typeMeta.array ? v : [v];
                const subquery = [];
                let returnMetaStatement = "";
                updates.forEach((update, index) => {
                    const relationshipVariable = `${varName}_${relationField.typeUnescaped.toLowerCase()}${index}_relationship`;
                    const relTypeStr = `[${relationshipVariable}:${relationField.type}]`;
                    const variableName = `${varName}_${key}${relationField.union ? `_${refNode.name}` : ""}${index}`;
                    if (update.delete) {
                        const innerVarName = `${variableName}_delete`;
                        const deleteAndParams = (0, create_delete_and_params_1.default)({
                            context,
                            node,
                            deleteInput: { [key]: update.delete },
                            varName: innerVarName,
                            chainStr: innerVarName,
                            parentVar,
                            withVars,
                            parameterPrefix: `${parameterPrefix}.${key}${relationField.typeMeta.array ? `[${index}]` : ``}.delete`,
                            recursing: true,
                        });
                        subquery.push(deleteAndParams[0]);
                        res.params = { ...res.params, ...deleteAndParams[1] };
                    }
                    if (update.disconnect) {
                        const disconnectAndParams = (0, create_disconnect_and_params_1.default)({
                            context,
                            refNodes: [refNode],
                            value: update.disconnect,
                            varName: `${variableName}_disconnect`,
                            withVars,
                            parentVar,
                            relationField,
                            labelOverride: relationField.union ? refNode.name : "",
                            parentNode: node,
                            parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ""}.disconnect`,
                        });
                        subquery.push(disconnectAndParams[0]);
                        res.params = { ...res.params, ...disconnectAndParams[1] };
                    }
                    if (update.update) {
                        const whereStrs = [];
                        const delayedSubquery = [];
                        let aggregationWhere = false;
                        if (update.where) {
                            try {
                                const { cypher: whereClause, subquery: preComputedSubqueries, params: whereParams, } = (0, create_connection_where_and_params_1.default)({
                                    whereInput: update.where,
                                    node: refNode,
                                    nodeVariable: variableName,
                                    relationship,
                                    relationshipVariable,
                                    context,
                                    parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.where`,
                                });
                                if (whereClause) {
                                    whereStrs.push(whereClause);
                                    res.params = { ...res.params, ...whereParams };
                                    if (preComputedSubqueries) {
                                        delayedSubquery.push(preComputedSubqueries);
                                        aggregationWhere = true;
                                    }
                                }
                            }
                            catch {
                                return;
                            }
                        }
                        const innerUpdate = [];
                        if (withVars) {
                            innerUpdate.push(`WITH ${withVars.join(", ")}`);
                        }
                        const labels = refNode.getLabelString(context);
                        innerUpdate.push(`MATCH (${parentVar})${inStr}${relTypeStr}${outStr}(${variableName}${labels})`);
                        innerUpdate.push(...delayedSubquery);
                        const authorizationBeforeAndParams = (0, create_authorization_before_and_params_1.createAuthorizationBeforeAndParams)({
                            context,
                            nodes: [{ node: refNode, variable: variableName }],
                            operations: ["UPDATE"],
                        });
                        if (authorizationBeforeAndParams) {
                            const { cypher, params: authWhereParams, subqueries } = authorizationBeforeAndParams;
                            whereStrs.push(cypher);
                            res.params = { ...res.params, ...authWhereParams };
                            if (subqueries) {
                                innerUpdate.push(subqueries);
                            }
                        }
                        if (whereStrs.length) {
                            const predicate = `${whereStrs.join(" AND ")}`;
                            if (aggregationWhere) {
                                const columns = [
                                    new cypher_builder_1.default.NamedVariable(relationshipVariable),
                                    new cypher_builder_1.default.NamedVariable(variableName),
                                ];
                                const caseWhereClause = (0, case_where_1.caseWhere)(new cypher_builder_1.default.RawCypher(predicate), columns);
                                const { cypher } = caseWhereClause.build("aggregateWhereFilter");
                                innerUpdate.push(cypher);
                            }
                            else {
                                innerUpdate.push(`WHERE ${predicate}`);
                            }
                        }
                        if (update.update.edge) {
                            const setProperties = (0, create_set_relationship_properties_1.default)({
                                properties: update.update.edge,
                                varName: relationshipVariable,
                                withVars: withVars,
                                relationship,
                                callbackBucket,
                                operation: "UPDATE",
                                parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.update.edge`,
                            });
                            innerUpdate.push(setProperties);
                        }
                        if (update.update.node) {
                            const nestedWithVars = [...withVars, variableName];
                            const nestedUpdateInput = Object.entries(update.update.node)
                                .filter(([k]) => {
                                if (k === "_on") {
                                    return false;
                                }
                                if (relationField.interface && update.update.node?._on?.[refNode.name]) {
                                    const onArray = Array.isArray(update.update.node._on[refNode.name])
                                        ? update.update.node._on[refNode.name]
                                        : [update.update.node._on[refNode.name]];
                                    if (onArray.some((onKey) => Object.prototype.hasOwnProperty.call(onKey, k))) {
                                        return false;
                                    }
                                }
                                return true;
                            })
                                .reduce((d1, [k1, v1]) => ({ ...d1, [k1]: v1 }), {});
                            const updateAndParams = createUpdateAndParams({
                                context,
                                callbackBucket,
                                node: refNode,
                                updateInput: nestedUpdateInput,
                                varName: variableName,
                                withVars: nestedWithVars,
                                parentVar: variableName,
                                chainStr: `${param}${relationField.union ? `_${refNode.name}` : ""}${index}`,
                                parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.update.node`,
                                includeRelationshipValidation: true,
                            });
                            res.params = { ...res.params, ...updateAndParams[1] };
                            innerUpdate.push(updateAndParams[0]);
                            if (relationField.interface && update.update.node?._on?.[refNode.name]) {
                                const onUpdateAndParams = createUpdateAndParams({
                                    context,
                                    callbackBucket,
                                    node: refNode,
                                    updateInput: update.update.node._on[refNode.name],
                                    varName: variableName,
                                    withVars: nestedWithVars,
                                    parentVar: variableName,
                                    chainStr: `${param}${relationField.union ? `_${refNode.name}` : ""}${index}_on_${refNode.name}`,
                                    parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ``}.update.node._on.${refNode.name}`,
                                });
                                res.params = { ...res.params, ...onUpdateAndParams[1] };
                                innerUpdate.push(onUpdateAndParams[0]);
                            }
                        }
                        if (context.subscriptionsEnabled) {
                            innerUpdate.push(`RETURN collect(${constants_1.META_CYPHER_VARIABLE}) as update_meta`);
                            returnMetaStatement = `meta AS update${idx}_meta`;
                            intermediateWithMetaStatements.push(`WITH *, update${idx}_meta AS meta`);
                        }
                        else {
                            innerUpdate.push(`RETURN count(*) AS update_${variableName}`);
                        }
                        subquery.push(`WITH ${withVars.join(", ")}`, "CALL {", (0, indent_block_1.indentBlock)(innerUpdate.join("\n")), "}");
                        if (context.subscriptionsEnabled) {
                            const reduceMeta = `REDUCE(m=${constants_1.META_CYPHER_VARIABLE}, n IN update_meta | m + n) AS ${constants_1.META_CYPHER_VARIABLE}`;
                            subquery.push(`WITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}, ${reduceMeta}`);
                        }
                    }
                    if (update.connect) {
                        const connectAndParams = (0, create_connect_and_params_1.default)({
                            context,
                            callbackBucket,
                            refNodes: [refNode],
                            value: update.connect,
                            varName: `${variableName}_connect`,
                            withVars,
                            parentVar,
                            relationField,
                            labelOverride: relationField.union ? refNode.name : "",
                            parentNode: node,
                            source: "UPDATE",
                        });
                        subquery.push(connectAndParams[0]);
                        if (context.subscriptionsEnabled) {
                            returnMetaStatement = `meta AS update${idx}_meta`;
                            intermediateWithMetaStatements.push(`WITH *, update${idx}_meta AS meta`);
                        }
                        res.params = { ...res.params, ...connectAndParams[1] };
                    }
                    if (update.connectOrCreate) {
                        const { cypher, params } = (0, create_connect_or_create_and_params_1.createConnectOrCreateAndParams)({
                            input: update.connectOrCreate,
                            varName: `${variableName}_connectOrCreate`,
                            parentVar: varName,
                            relationField,
                            refNode,
                            node,
                            context,
                            withVars,
                            callbackBucket,
                        });
                        subquery.push(cypher);
                        res.params = { ...res.params, ...params };
                    }
                    if (update.create) {
                        if (withVars) {
                            subquery.push(`WITH ${withVars.join(", ")}`);
                        }
                        const creates = relationField.typeMeta.array ? update.create : [update.create];
                        creates.forEach((create, i) => {
                            const baseName = `${variableName}_create${i}`;
                            const nodeName = `${baseName}_node`;
                            const propertiesName = `${baseName}_relationship`;
                            let createNodeInput = {
                                input: create.node,
                            };
                            if (relationField.interface) {
                                const nodeFields = create.node[refNode.name];
                                if (!nodeFields)
                                    return; // Interface specific type not defined
                                createNodeInput = {
                                    input: nodeFields,
                                };
                            }
                            const { create: nestedCreate, params, authorizationPredicates, authorizationSubqueries, } = (0, create_create_and_params_1.default)({
                                context,
                                node: refNode,
                                callbackBucket,
                                varName: nodeName,
                                withVars: [...withVars, nodeName],
                                includeRelationshipValidation: false,
                                ...createNodeInput,
                            });
                            subquery.push(nestedCreate);
                            res.params = { ...res.params, ...params };
                            const relationVarName = create.edge || context.subscriptionsEnabled ? propertiesName : "";
                            subquery.push(`MERGE (${parentVar})${inStr}[${relationVarName}:${relationField.type}]${outStr}(${nodeName})`);
                            if (create.edge) {
                                const setA = (0, create_set_relationship_properties_1.default)({
                                    properties: create.edge,
                                    varName: propertiesName,
                                    withVars,
                                    relationship,
                                    callbackBucket,
                                    operation: "CREATE",
                                    parameterPrefix: `${parameterPrefix}.${key}${relationField.union ? `.${refNode.name}` : ""}[${index}].create[${i}].edge`,
                                });
                                subquery.push(setA);
                            }
                            subquery.push(...(0, get_authorization_statements_1.getAuthorizationStatements)(authorizationPredicates, authorizationSubqueries));
                            if (context.subscriptionsEnabled) {
                                const [fromVariable, toVariable] = relationField.direction === "IN" ? [nodeName, varName] : [varName, nodeName];
                                const [fromTypename, toTypename] = relationField.direction === "IN"
                                    ? [refNode.name, node.name]
                                    : [node.name, refNode.name];
                                const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMeta)({
                                    event: "create_relationship",
                                    relVariable: propertiesName,
                                    fromVariable,
                                    toVariable,
                                    typename: relationField.typeUnescaped,
                                    fromTypename,
                                    toTypename,
                                });
                                subquery.push(`WITH ${eventWithMetaStr}, ${(0, filter_meta_variable_1.filterMetaVariable)([...withVars, nodeName]).join(", ")}`);
                                returnMetaStatement = `meta AS update${idx}_meta`;
                                intermediateWithMetaStatements.push(`WITH *, update${idx}_meta AS meta`);
                            }
                            const relationshipValidationStr = (0, create_relationship_validation_string_1.default)({
                                node: refNode,
                                context,
                                varName: nodeName,
                            });
                            if (relationshipValidationStr) {
                                subquery.push(`WITH ${[...withVars, nodeName].join(", ")}`);
                                subquery.push(relationshipValidationStr);
                            }
                        });
                    }
                    if (relationField.interface) {
                        const returnStatement = `RETURN count(*) AS update_${varName}_${refNode.name}`;
                        if (context.subscriptionsEnabled && returnMetaStatement) {
                            subquery.push(`RETURN ${returnMetaStatement}`);
                        }
                        else {
                            subquery.push(returnStatement);
                        }
                    }
                });
                if (subquery.length) {
                    subqueries.push(subquery.join("\n"));
                }
            });
            if (relationField.interface) {
                res.strs.push(`WITH ${withVars.join(", ")}`);
                res.strs.push(`CALL {\n\t WITH ${withVars.join(", ")}\n\t`);
                const subqueriesWithMetaPassedOn = subqueries.map((each, i) => each + `\n}\n${intermediateWithMetaStatements[i] || ""}`);
                res.strs.push(subqueriesWithMetaPassedOn.join(`\nCALL {\n\t WITH ${withVars.join(", ")}\n\t`));
            }
            else {
                res.strs.push(subqueries.join("\n"));
            }
            return res;
        }
        if (!hasAppliedTimeStamps) {
            const timestampedFields = node.temporalFields.filter((temporalField) => ["DateTime", "Time"].includes(temporalField.typeMeta.name) &&
                temporalField.timestamps?.includes("UPDATE"));
            timestampedFields.forEach((field) => {
                // DateTime -> datetime(); Time -> time()
                res.strs.push(`SET ${varName}.${field.dbPropertyName} = ${field.typeMeta.name.toLowerCase()}()`);
            });
            hasAppliedTimeStamps = true;
        }
        node.primitiveFields.forEach((field) => (0, callback_utils_1.addCallbackAndSetParam)(field, varName, updateInput, callbackBucket, res.strs, "UPDATE"));
        const mathMatch = (0, math_1.matchMathField)(key);
        const { hasMatched, propertyName } = mathMatch;
        const settableFieldComparator = hasMatched ? propertyName : key;
        const settableField = node.mutableFields.find((x) => x.fieldName === settableFieldComparator);
        const authableField = node.authableFields.find((x) => x.fieldName === key || `${x.fieldName}_PUSH` === key || `${x.fieldName}_POP` === key);
        if (settableField) {
            if (settableField.typeMeta.required && value === null) {
                throw new Error(`Cannot set non-nullable field ${node.name}.${settableField.fieldName} to null`);
            }
            if (pointField) {
                if (pointField.typeMeta.array) {
                    res.strs.push(`SET ${varName}.${dbFieldName} = [p in $${param} | point(p)]`);
                }
                else {
                    res.strs.push(`SET ${varName}.${dbFieldName} = point($${param})`);
                }
            }
            else if (hasMatched) {
                const mathDescriptor = (0, math_1.mathDescriptorBuilder)(value, node, mathMatch);
                if (updateInput[mathDescriptor.dbName]) {
                    throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${mathDescriptor.dbName}`);
                }
                const mathStatements = (0, math_1.buildMathStatements)(mathDescriptor, varName, withVars, param);
                res.strs.push(...mathStatements);
            }
            else {
                res.strs.push(`SET ${varName}.${dbFieldName} = $${param}`);
            }
            res.params[param] = value;
        }
        if (authableField) {
            const authorizationBeforeAndParams = (0, create_authorization_before_and_params_1.createAuthorizationBeforeAndParams)({
                context,
                nodes: [{ node: node, variable: varName, fieldName: authableField.fieldName }],
                operations: ["UPDATE"],
            });
            if (authorizationBeforeAndParams) {
                const { cypher, params: authWhereParams, subqueries } = authorizationBeforeAndParams;
                res.meta.authorizationBeforePredicates.push(cypher);
                if (subqueries) {
                    res.meta.authorizationBeforeSubqueries.push(subqueries);
                }
                res.params = { ...res.params, ...authWhereParams };
            }
            const authorizationAfterAndParams = (0, create_authorization_after_and_params_1.createAuthorizationAfterAndParams)({
                context,
                nodes: [{ node: node, variable: varName, fieldName: authableField.fieldName }],
                operations: ["UPDATE"],
            });
            if (authorizationAfterAndParams) {
                const { cypher, params: authWhereParams, subqueries } = authorizationAfterAndParams;
                res.meta.authorizationAfterPredicates.push(cypher);
                if (subqueries) {
                    res.meta.authorizationAfterSubqueries.push(subqueries);
                }
                res.params = { ...res.params, ...authWhereParams };
            }
        }
        const pushSuffix = "_PUSH";
        const pushField = node.mutableFields.find((x) => `${x.fieldName}${pushSuffix}` === key);
        if (pushField) {
            if (pushField.dbPropertyName && updateInput[pushField.dbPropertyName]) {
                throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${pushField.dbPropertyName}`);
            }
            validateNonNullProperty(res, varName, pushField);
            (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["UPDATE"], field: pushField.fieldName });
            const pointArrayField = node.pointFields.find((x) => `${x.fieldName}_PUSH` === key);
            if (pointArrayField) {
                res.strs.push(`SET ${varName}.${pushField.dbPropertyName} = ${varName}.${pushField.dbPropertyName} + [p in $${param} | point(p)]`);
            }
            else {
                res.strs.push(`SET ${varName}.${pushField.dbPropertyName} = ${varName}.${pushField.dbPropertyName} + $${param}`);
            }
            res.params[param] = value;
        }
        const popSuffix = `_POP`;
        const popField = node.mutableFields.find((x) => `${x.fieldName}${popSuffix}` === key);
        if (popField) {
            if (popField.dbPropertyName && updateInput[popField.dbPropertyName]) {
                throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${popField.dbPropertyName}`);
            }
            validateNonNullProperty(res, varName, popField);
            (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["UPDATE"], field: popField.fieldName });
            res.strs.push(`SET ${varName}.${popField.dbPropertyName} = ${varName}.${popField.dbPropertyName}[0..-$${param}]`);
            res.params[param] = value;
        }
        if (!pushField && !popField) {
            (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["UPDATE"], field: key });
        }
        return res;
    }
    const reducedUpdate = Object.entries(updateInput).reduce(reducer, {
        strs: [],
        meta: {
            preArrayMethodValidationStrs: [],
            authorizationBeforeSubqueries: [],
            authorizationBeforePredicates: [],
            authorizationAfterSubqueries: [],
            authorizationAfterPredicates: [],
        },
        params: {},
    });
    const { strs, meta } = reducedUpdate;
    let params = reducedUpdate.params;
    const authorizationBeforeStrs = meta.authorizationBeforePredicates;
    const authorizationBeforeSubqueries = meta.authorizationBeforeSubqueries;
    const authorizationAfterStrs = meta.authorizationAfterPredicates;
    const authorizationAfterSubqueries = meta.authorizationAfterSubqueries;
    const withStr = `WITH ${withVars.join(", ")}`;
    const authorizationAfterAndParams = (0, create_authorization_after_and_params_1.createAuthorizationAfterAndParams)({
        context,
        nodes: [{ node, variable: varName }],
        operations: ["UPDATE"],
    });
    if (authorizationAfterAndParams) {
        const { cypher, params: authWhereParams, subqueries } = authorizationAfterAndParams;
        if (cypher) {
            if (subqueries) {
                authorizationAfterSubqueries.push(subqueries);
            }
            authorizationAfterStrs.push(cypher);
            params = { ...params, ...authWhereParams };
        }
    }
    const preUpdatePredicates = authorizationBeforeStrs;
    const preArrayMethodValidationStr = "";
    const relationshipValidationStr = includeRelationshipValidation
        ? (0, create_relationship_validation_string_1.default)({ node, context, varName })
        : "";
    if (meta.preArrayMethodValidationStrs.length) {
        const nullChecks = meta.preArrayMethodValidationStrs.map((validationStr) => `${validationStr[0]} IS NULL`);
        const propertyNames = meta.preArrayMethodValidationStrs.map((validationStr) => validationStr[1]);
        preUpdatePredicates.push(`apoc.util.validatePredicate(${nullChecks.join(" OR ")}, "${(0, pluralize_1.default)("Property", propertyNames.length)} ${propertyNames.map(() => "%s").join(", ")} cannot be NULL", [${(0, wrap_string_in_apostrophes_1.wrapStringInApostrophes)(propertyNames).join(", ")}])`);
    }
    let preUpdatePredicatesStr = "";
    let authorizationAfterStr = "";
    if (preUpdatePredicates.length) {
        if (authorizationBeforeSubqueries.length) {
            preUpdatePredicatesStr = `${withStr}\n${authorizationBeforeSubqueries.join("\n")}\nWITH *\nWHERE ${preUpdatePredicates.join(" AND ")}`;
        }
        else {
            preUpdatePredicatesStr = `${withStr}\nWHERE ${preUpdatePredicates.join(" AND ")}`;
        }
    }
    if (authorizationAfterStrs.length) {
        if (authorizationAfterSubqueries.length) {
            authorizationAfterStr = `${withStr}\n${authorizationAfterSubqueries.join("\n")}\nWITH *\nWHERE ${authorizationAfterStrs.join(" AND ")}`;
        }
        else {
            authorizationAfterStr = `${withStr}\nWHERE ${authorizationAfterStrs.join(" AND ")}`;
        }
    }
    let statements = strs;
    if (context.subscriptionsEnabled) {
        statements = wrapInSubscriptionsMetaCall({
            withVars,
            nodeVariable: varName,
            typename: node.name,
            statements: strs,
        });
    }
    return [
        [
            preUpdatePredicatesStr,
            preArrayMethodValidationStr,
            ...statements,
            authorizationAfterStr,
            ...(relationshipValidationStr ? [withStr, relationshipValidationStr] : []),
        ].join("\n"),
        params,
    ];
}
exports.default = createUpdateAndParams;
function validateNonNullProperty(res, varName, field) {
    res.meta.preArrayMethodValidationStrs.push([`${varName}.${field.dbPropertyName}`, `${field.dbPropertyName}`]);
}
function wrapInSubscriptionsMetaCall({ statements, nodeVariable, typename, withVars, }) {
    const updateMetaVariable = "update_meta";
    const preCallWith = `WITH ${nodeVariable} { .* } AS ${constants_1.META_OLD_PROPS_CYPHER_VARIABLE}, ${withVars.join(", ")}`;
    const callBlock = ["WITH *", ...statements, `RETURN ${constants_1.META_CYPHER_VARIABLE} as ${updateMetaVariable}`];
    const postCallWith = `WITH *, ${updateMetaVariable} as ${constants_1.META_CYPHER_VARIABLE}`;
    const eventMeta = (0, create_event_meta_1.createEventMeta)({ event: "update", nodeVariable, typename });
    const eventMetaWith = `WITH ${(0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ")}, ${eventMeta}`;
    return [preCallWith, "CALL {", ...(0, indent_block_1.indentBlock)(callBlock), "}", postCallWith, eventMetaWith];
}
//# sourceMappingURL=create-update-and-params.js.map