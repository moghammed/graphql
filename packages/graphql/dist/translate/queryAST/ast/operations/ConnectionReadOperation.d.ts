import type { Field } from "../fields/Field";
import type { Filter } from "../filters/Filter";
import Cypher from "@neo4j/cypher-builder";
import type { OperationTranspileOptions, OperationTranspileResult } from "./operations";
import { Operation } from "./operations";
import type { Pagination, PaginationField } from "../pagination/Pagination";
import type { Sort, SortField } from "../sort/Sort";
import type { QueryASTContext } from "../QueryASTContext";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { AuthorizationFilters } from "../filters/authorization-filters/AuthorizationFilters";
import type { QueryASTNode } from "../QueryASTNode";
export declare class ConnectionReadOperation extends Operation {
    readonly relationship: RelationshipAdapter;
    readonly target: ConcreteEntityAdapter;
    protected directed: boolean;
    nodeFields: Field[];
    edgeFields: Field[];
    protected filters: Filter[];
    protected pagination: Pagination | undefined;
    protected sortFields: Array<{
        node: Sort[];
        edge: Sort[];
    }>;
    protected authFilters: AuthorizationFilters[];
    constructor({
        relationship,
        directed,
        target,
    }: {
        relationship: RelationshipAdapter;
        target: ConcreteEntityAdapter;
        directed: boolean;
    });
    setNodeFields(fields: Field[]): void;
    setFilters(filters: Filter[]): void;
    setEdgeFields(fields: Field[]): void;
    addAuthFilters(...filter: AuthorizationFilters[]): void;
    protected getAuthFilterSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getAuthFilterPredicate(context: QueryASTContext): Cypher.Predicate[];
    addSort(sortElement: { node: Sort[]; edge: Sort[] }): void;
    addPagination(pagination: Pagination): void;
    getChildren(): QueryASTNode[];
    protected getSelectionClauses(
        context: QueryASTContext,
        node: Cypher.Node | Cypher.Pattern
    ): {
        preSelection: Array<Cypher.Match | Cypher.With>;
        selectionClause: Cypher.Match | Cypher.With;
    };
    transpile({ context, returnVariable }: OperationTranspileOptions): OperationTranspileResult;
    protected getPaginationSubquery(
        context: QueryASTContext,
        edgesVar: Cypher.Variable,
        paginationField: PaginationField | undefined
    ): Cypher.With;
    protected getSortFields(
        context: QueryASTContext,
        nodeVar: Cypher.Variable | Cypher.Property,
        edgeVar: Cypher.Variable | Cypher.Property
    ): SortField[];
}
//# sourceMappingURL=ConnectionReadOperation.d.ts.map
