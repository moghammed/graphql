import type { Filter } from "../filters/Filter";
import Cypher from "@neo4j/cypher-builder";
import type { OperationTranspileOptions, OperationTranspileResult } from "./operations";
import { Operation } from "./operations";
import type { Pagination } from "../pagination/Pagination";
import type { AggregationField } from "../fields/aggregation-fields/AggregationField";
import type { QueryASTContext } from "../QueryASTContext";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { QueryASTNode } from "../QueryASTNode";
import type { Sort } from "../sort/Sort";
import type { AuthorizationFilters } from "../filters/authorization-filters/AuthorizationFilters";
export declare class AggregationOperation extends Operation {
    readonly entity: ConcreteEntityAdapter | RelationshipAdapter;
    protected directed: boolean;
    fields: AggregationField[];
    nodeFields: AggregationField[];
    edgeFields: AggregationField[];
    protected authFilters: AuthorizationFilters[];
    aggregationProjectionMap: Cypher.Map;
    protected filters: Filter[];
    protected pagination: Pagination | undefined;
    protected sortFields: Sort[];
    nodeAlias: string | undefined;
    constructor(entity: ConcreteEntityAdapter | RelationshipAdapter, directed?: boolean);
    setFields(fields: AggregationField[]): void;
    addSort(...sort: Sort[]): void;
    addPagination(pagination: Pagination): void;
    setFilters(filters: Filter[]): void;
    addAuthFilters(...filter: AuthorizationFilters[]): void;
    getChildren(): QueryASTNode[];
    private createSubquery;
    private transpileNestedRelationship;
    protected getFieldProjectionClause(
        target: Cypher.Variable,
        returnVariable: Cypher.Variable,
        field: AggregationField
    ): Cypher.Clause;
    private getPredicates;
    protected getAuthFilterPredicate(context: QueryASTContext): Cypher.Predicate[];
    transpile({ context }: OperationTranspileOptions): OperationTranspileResult;
    private addSortToClause;
    setNodeFields(fields: AggregationField[]): void;
    setEdgeFields(fields: AggregationField[]): void;
}
//# sourceMappingURL=AggregationOperation.d.ts.map
