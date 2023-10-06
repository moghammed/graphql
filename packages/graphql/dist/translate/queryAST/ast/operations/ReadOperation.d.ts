import type { Field } from "../fields/Field";
import type { Filter } from "../filters/Filter";
import Cypher from "@neo4j/cypher-builder";
import type { OperationTranspileOptions, OperationTranspileResult } from "./operations";
import { Operation } from "./operations";
import type { Pagination } from "../pagination/Pagination";
import type { QueryASTContext } from "../QueryASTContext";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { AuthorizationFilters } from "../filters/authorization-filters/AuthorizationFilters";
import type { QueryASTNode } from "../QueryASTNode";
import type { Sort } from "../sort/Sort";
export declare class ReadOperation extends Operation {
    readonly target: ConcreteEntityAdapter;
    readonly relationship: RelationshipAdapter | undefined;
    protected directed: boolean;
    fields: Field[];
    protected filters: Filter[];
    protected authFilters: AuthorizationFilters[];
    protected pagination: Pagination | undefined;
    protected sortFields: Sort[];
    nodeAlias: string | undefined;
    constructor({
        target,
        relationship,
        directed,
    }: {
        target: ConcreteEntityAdapter;
        relationship?: RelationshipAdapter;
        directed?: boolean;
    });
    setFields(fields: Field[]): void;
    addSort(...sort: Sort[]): void;
    addPagination(pagination: Pagination): void;
    setFilters(filters: Filter[]): void;
    addAuthFilters(...filter: AuthorizationFilters[]): void;
    protected getAuthFilterSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getAuthFilterPredicate(context: QueryASTContext): Cypher.Predicate[];
    private transpileNestedRelationship;
    protected getProjectionClause(
        context: QueryASTContext,
        returnVariable: Cypher.Variable,
        isArray: boolean
    ): Cypher.Return;
    protected getPredicates(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected getSelectionClauses(
        context: QueryASTContext,
        node: Cypher.Node | Cypher.Pattern
    ): {
        preSelection: Array<Cypher.Match | Cypher.With>;
        selectionClause: Cypher.Match | Cypher.With;
    };
    transpile({ context, returnVariable }: OperationTranspileOptions): OperationTranspileResult;
    private hasCypherSort;
    getChildren(): QueryASTNode[];
    protected getFieldsSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getCypherFieldsSubqueries(context: QueryASTContext): Cypher.Clause[];
    private getCypherFields;
    protected getProjectionMap(context: QueryASTContext): Cypher.MapProjection;
    protected addSortToClause(context: QueryASTContext, node: Cypher.Node, clause: Cypher.With | Cypher.Return): void;
}
//# sourceMappingURL=ReadOperation.d.ts.map
