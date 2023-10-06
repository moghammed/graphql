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
exports.OperationsFactory = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_relay_1 = require("graphql-relay");
const neo4j_driver_1 = require("neo4j-driver");
const RelationshipAdapter_1 = require("../../../schema-model/relationship/model-adapters/RelationshipAdapter");
const utils_2 = require("../../../utils/utils");
const check_authentication_1 = require("../../authorization/check-authentication");
const AggregationOperation_1 = require("../ast/operations/AggregationOperation");
const ConnectionReadOperation_1 = require("../ast/operations/ConnectionReadOperation");
const ReadOperation_1 = require("../ast/operations/ReadOperation");
const CompositeConnectionPartial_1 = require("../ast/operations/composite/CompositeConnectionPartial");
const CompositeConnectionReadOperation_1 = require("../ast/operations/composite/CompositeConnectionReadOperation");
const CompositeReadOperation_1 = require("../ast/operations/composite/CompositeReadOperation");
const CompositeReadPartial_1 = require("../ast/operations/composite/CompositeReadPartial");
const get_concrete_entities_in_on_argument_of_where_1 = require("../utils/get-concrete-entities-in-on-argument-of-where");
const get_concrete_where_1 = require("../utils/get-concrete-where");
const is_concrete_entity_1 = require("../utils/is-concrete-entity");
const is_interface_entity_1 = require("../utils/is-interface-entity");
const is_union_entity_1 = require("../utils/is-union-entity");
const AuthFilterFactory_1 = require("./AuthFilterFactory");
const AuthorizationFactory_1 = require("./AuthorizationFactory");
const FieldFactory_1 = require("./FieldFactory");
const FilterFactory_1 = require("./FilterFactory");
const SortAndPaginationFactory_1 = require("./SortAndPaginationFactory");
const parse_selection_set_fields_1 = require("./parsers/parse-selection-set-fields");
class OperationsFactory {
    constructor(queryASTFactory) {
        this.filterFactory = new FilterFactory_1.FilterFactory(queryASTFactory);
        this.fieldFactory = new FieldFactory_1.FieldFactory(queryASTFactory);
        this.sortAndPaginationFactory = new SortAndPaginationFactory_1.SortAndPaginationFactory();
        const authFilterFactory = new AuthFilterFactory_1.AuthFilterFactory(queryASTFactory);
        this.authorizationFactory = new AuthorizationFactory_1.AuthorizationFactory(authFilterFactory);
    }
    createReadOperation(entityOrRel, resolveTree, context) {
        const entity = entityOrRel instanceof RelationshipAdapter_1.RelationshipAdapter ? entityOrRel.target : entityOrRel;
        const relationship = entityOrRel instanceof RelationshipAdapter_1.RelationshipAdapter ? entityOrRel : undefined;
        const resolveTreeWhere = (0, utils_2.isObject)(resolveTree.args.where) ? resolveTree.args.where : {};
        if ((0, is_concrete_entity_1.isConcreteEntity)(entity)) {
            (0, check_authentication_1.checkEntityAuthentication)({
                entity: entity.entity,
                targetOperations: ["READ"],
                context,
            });
            const operation = new ReadOperation_1.ReadOperation({
                target: entity,
                relationship,
                directed: Boolean(resolveTree.args?.directed ?? true),
            });
            return this.hydrateReadOperation({
                operation,
                entity,
                resolveTree,
                context,
                whereArgs: resolveTreeWhere,
            });
        }
        else {
            const concreteEntities = (0, get_concrete_entities_in_on_argument_of_where_1.getConcreteEntitiesInOnArgumentOfWhere)(entity, resolveTreeWhere);
            const concreteReadOperations = concreteEntities.map((concreteEntity) => {
                const readPartial = new CompositeReadPartial_1.CompositeReadPartial({
                    relationship,
                    directed: Boolean(resolveTree.args?.directed ?? true),
                    target: concreteEntity,
                });
                const whereArgs = (0, get_concrete_where_1.getConcreteWhere)(entity, concreteEntity, resolveTreeWhere);
                return this.hydrateReadOperation({
                    entity: concreteEntity,
                    resolveTree,
                    context,
                    operation: readPartial,
                    whereArgs: whereArgs,
                });
            });
            const compositeReadOp = new CompositeReadOperation_1.CompositeReadOperation({
                compositeEntity: entity,
                children: concreteReadOperations,
                relationship,
            });
            this.hydrateCompositeReadOperationWithPagination(entity, compositeReadOp, resolveTree);
            return compositeReadOp;
        }
    }
    // TODO: dupe from read operation
    createAggregationOperation(relationship, resolveTree, context) {
        const entity = relationship.target;
        if ((0, is_concrete_entity_1.isConcreteEntity)(entity)) {
            (0, check_authentication_1.checkEntityAuthentication)({
                entity: entity.entity,
                targetOperations: ["AGGREGATE"],
                context,
            });
        }
        const rawProjectionFields = {
            ...resolveTree.fieldsByTypeName[relationship.operations.getAggregationFieldTypename()],
        };
        const parsedProjectionFields = this.splitConnectionFields(rawProjectionFields);
        const projectionFields = parsedProjectionFields.fields;
        const edgeRawFields = {
            ...parsedProjectionFields.edge?.fieldsByTypeName[relationship.operations.getAggregationFieldTypename("edge")],
        };
        const nodeRawFields = {
            ...parsedProjectionFields.node?.fieldsByTypeName[relationship.operations.getAggregationFieldTypename("node")],
        };
        const whereArgs = (resolveTree.args.where || {});
        const operation = new AggregationOperation_1.AggregationOperation(relationship, Boolean(resolveTree.args?.directed ?? true));
        const fields = this.fieldFactory.createAggregationFields(entity, projectionFields);
        const nodeFields = this.fieldFactory.createAggregationFields(entity, nodeRawFields);
        const edgeFields = this.fieldFactory.createAggregationFields(relationship, edgeRawFields);
        const authFilters = this.authorizationFactory.createEntityAuthFilters(entity, ["AGGREGATE"], context);
        const filters = this.filterFactory.createNodeFilters(relationship.target, whereArgs); // Aggregation filters only apply to target node
        operation.setFields(fields);
        operation.setNodeFields(nodeFields);
        operation.setEdgeFields(edgeFields);
        operation.setFilters(filters);
        if (authFilters) {
            operation.addAuthFilters(authFilters);
        }
        // TODO: Duplicate logic with hydrateReadOperationWithPagination, check if it's correct to unify.
        const options = this.getOptions(entity, (resolveTree.args.options ?? {}));
        if (options) {
            const sort = this.sortAndPaginationFactory.createSortFields(options, entity);
            operation.addSort(...sort);
            const pagination = this.sortAndPaginationFactory.createPagination(options);
            if (pagination) {
                operation.addPagination(pagination);
            }
        }
        return operation;
    }
    createConnectionOperationAST(relationship, resolveTree, context) {
        const target = relationship.target;
        const directed = Boolean(resolveTree.args.directed) ?? true;
        const resolveTreeWhere = (0, utils_2.isObject)(resolveTree.args.where) ? resolveTree.args.where : {};
        if ((0, is_concrete_entity_1.isConcreteEntity)(target)) {
            (0, check_authentication_1.checkEntityAuthentication)({
                entity: target.entity,
                targetOperations: ["READ"],
                context,
            });
            const operation = new ConnectionReadOperation_1.ConnectionReadOperation({ relationship, directed, target });
            return this.hydrateConnectionOperationAST({
                relationship,
                target: target,
                resolveTree,
                context,
                operation,
                whereArgs: resolveTreeWhere,
            });
        }
        else {
            let concreteConnectionOperations = [];
            let nodeWhere;
            if ((0, is_interface_entity_1.isInterfaceEntity)(target)) {
                nodeWhere = (0, utils_2.isObject)(resolveTreeWhere) ? resolveTreeWhere.node : {};
            }
            else {
                nodeWhere = resolveTreeWhere;
            }
            const concreteEntities = (0, get_concrete_entities_in_on_argument_of_where_1.getConcreteEntitiesInOnArgumentOfWhere)(target, nodeWhere);
            concreteConnectionOperations = concreteEntities.map((concreteEntity) => {
                const connectionPartial = new CompositeConnectionPartial_1.CompositeConnectionPartial({
                    relationship,
                    directed,
                    target: concreteEntity,
                });
                // nodeWhere with the shared filters applied
                const concreteNodeWhere = (0, get_concrete_where_1.getConcreteWhere)(target, concreteEntity, nodeWhere);
                let whereArgs;
                if ((0, is_interface_entity_1.isInterfaceEntity)(target)) {
                    whereArgs = { edge: resolveTreeWhere.edge ?? {}, node: concreteNodeWhere };
                }
                else {
                    whereArgs = concreteNodeWhere;
                }
                return this.hydrateConnectionOperationAST({
                    relationship,
                    target: concreteEntity,
                    resolveTree,
                    context,
                    operation: connectionPartial,
                    whereArgs: whereArgs,
                });
            });
            const compositeConnectionOp = new CompositeConnectionReadOperation_1.CompositeConnectionReadOperation(concreteConnectionOperations);
            // These sort fields will be duplicated on nested "CompositeConnectionPartial"
            this.hydrateConnectionOperationsASTWithSort({
                relationship,
                resolveTree,
                operation: compositeConnectionOp,
            });
            return compositeConnectionOp;
        }
    }
    // eslint-disable-next-line @typescript-eslint/comma-dangle
    hydrateConnectionOperationsASTWithSort({ relationship, resolveTree, operation, }) {
        let options;
        if (!(0, is_union_entity_1.isUnionEntity)(relationship.target)) {
            options = this.getConnectionOptions(relationship.target, resolveTree.args);
        }
        else {
            options = resolveTree.args;
        }
        const first = options?.first;
        const sort = options?.sort;
        const afterArg = options?.after;
        const offset = (0, utils_2.isString)(afterArg) ? (0, graphql_relay_1.cursorToOffset)(afterArg) + 1 : undefined;
        if (first || offset) {
            const pagination = this.sortAndPaginationFactory.createPagination({
                limit: first,
                offset,
            });
            if (pagination) {
                operation.addPagination(pagination);
            }
        }
        if (sort) {
            sort.forEach((options) => {
                const sort = this.sortAndPaginationFactory.createConnectionSortFields(options, relationship);
                operation.addSort(sort);
            });
        }
        return operation;
    }
    findFieldsByNameInResolveTree(resolveTreeObject, fieldName) {
        return Object.values(resolveTreeObject).filter((resolveTreeField) => resolveTreeField.name === fieldName);
    }
    hydrateConnectionOperationAST({ relationship, target, resolveTree, context, operation, whereArgs, }) {
        const resolveTreeConnectionFields = {
            ...resolveTree.fieldsByTypeName[relationship.operations.connectionFieldTypename],
        };
        const edgeFieldsRaw = this.findFieldsByNameInResolveTree(resolveTreeConnectionFields, "edges");
        const resolveTreeEdgeFields = (0, utils_1.mergeDeep)((0, utils_2.filterTruthy)(edgeFieldsRaw.map((edgeField) => edgeField?.fieldsByTypeName[relationship.operations.relationshipFieldTypename]))) ?? {};
        const nodeFieldsRaw = this.findFieldsByNameInResolveTree(resolveTreeEdgeFields, "node");
        const resolveTreeNodeFields = (0, utils_1.mergeDeep)((0, utils_2.filterTruthy)(nodeFieldsRaw.map((nodeField) => ({
            ...nodeField?.fieldsByTypeName[target.name],
            ...nodeField?.fieldsByTypeName[relationship.target.name],
        })))) ?? {};
        this.hydrateConnectionOperationsASTWithSort({
            relationship,
            resolveTree,
            operation,
        });
        const nodeFields = this.fieldFactory.createFields(target, resolveTreeNodeFields, context);
        const edgeFields = this.fieldFactory.createFields(relationship, resolveTreeEdgeFields, context);
        const authFilters = this.authorizationFactory.createEntityAuthFilters(target, ["READ"], context);
        const authNodeAttributeFilters = this.createAttributeAuthFilters({
            entity: target,
            context,
            rawFields: resolveTreeNodeFields,
        });
        const filters = this.filterFactory.createConnectionPredicates(relationship, target, whereArgs);
        operation.setNodeFields(nodeFields);
        operation.setEdgeFields(edgeFields);
        operation.setFilters(filters);
        if (authFilters) {
            operation.addAuthFilters(authFilters);
        }
        if (authNodeAttributeFilters) {
            operation.addAuthFilters(...authNodeAttributeFilters);
        }
        return operation;
    }
    splitConnectionFields(rawFields) {
        let nodeField;
        let edgeField;
        const fields = {};
        Object.entries(rawFields).forEach(([key, field]) => {
            if (field.name === "node") {
                nodeField = field;
            }
            else if (field.name === "edge") {
                edgeField = field;
            }
            else {
                fields[key] = field;
            }
        });
        return {
            node: nodeField,
            edge: edgeField,
            fields,
        };
    }
    hydrateReadOperation({ entity, operation, resolveTree, context, whereArgs, }) {
        let projectionFields = { ...resolveTree.fieldsByTypeName[entity.name] };
        // Get the abstract types of the interface
        const entityInterfaces = entity.compositeEntities;
        const interfacesFields = (0, utils_2.filterTruthy)(entityInterfaces.map((i) => resolveTree.fieldsByTypeName[i.name]));
        projectionFields = (0, utils_1.mergeDeep)([...interfacesFields, projectionFields]);
        const fields = this.fieldFactory.createFields(entity, projectionFields, context);
        const authFilters = this.authorizationFactory.createEntityAuthFilters(entity, ["READ"], context);
        const authAttributeFilters = this.createAttributeAuthFilters({
            entity,
            context,
            rawFields: projectionFields,
        });
        const filters = this.filterFactory.createNodeFilters(entity, whereArgs);
        operation.setFields(fields);
        operation.setFilters(filters);
        if (authFilters) {
            operation.addAuthFilters(authFilters);
        }
        if (authAttributeFilters) {
            operation.addAuthFilters(...authAttributeFilters);
        }
        this.hydrateCompositeReadOperationWithPagination(entity, operation, resolveTree);
        return operation;
    }
    getOptions(entity, options) {
        const limitDirective = (0, is_union_entity_1.isUnionEntity)(entity) ? undefined : entity.annotations.limit;
        let limit = options?.limit ?? limitDirective?.default ?? limitDirective?.max;
        if (limit instanceof neo4j_driver_1.Integer) {
            limit = limit.toNumber();
        }
        const maxLimit = limitDirective?.max;
        if (limit !== undefined && maxLimit !== undefined) {
            limit = Math.min(limit, maxLimit);
        }
        if (limit === undefined && options.offset === undefined && options.sort === undefined)
            return undefined;
        return {
            limit,
            offset: options.offset,
            sort: options.sort,
        };
    }
    getConnectionOptions(entity, options) {
        const limitDirective = entity.annotations.limit;
        let limit = options?.first ?? limitDirective?.default ?? limitDirective?.max;
        if (limit instanceof neo4j_driver_1.Integer) {
            limit = limit.toNumber();
        }
        const maxLimit = limitDirective?.max;
        if (limit !== undefined && maxLimit !== undefined) {
            limit = Math.min(limit, maxLimit);
        }
        if (limit === undefined && options.after === undefined && options.sort === undefined)
            return undefined;
        return {
            first: limit,
            after: options.after,
            sort: options.sort,
        };
    }
    createAttributeAuthFilters({ entity, rawFields, context, }) {
        return (0, utils_2.filterTruthy)(Object.values(rawFields).map((field) => {
            const { fieldName } = (0, parse_selection_set_fields_1.parseSelectionSetField)(field.name);
            const attribute = entity.findAttribute(fieldName);
            if (!attribute)
                return undefined;
            const result = this.authorizationFactory.createAttributeAuthFilters(attribute, entity, ["READ"], context);
            return result;
        }));
    }
    hydrateCompositeReadOperationWithPagination(entity, operation, resolveTree) {
        const options = this.getOptions(entity, (resolveTree.args.options ?? {}));
        if (options) {
            const sort = this.sortAndPaginationFactory.createSortFields(options, entity);
            operation.addSort(...sort);
            const pagination = this.sortAndPaginationFactory.createPagination(options);
            if (pagination) {
                operation.addPagination(pagination);
            }
        }
    }
}
exports.OperationsFactory = OperationsFactory;
//# sourceMappingURL=OperationFactory.js.map