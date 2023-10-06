import Cypher from "@neo4j/cypher-builder";
import type { RelationshipWhereOperator } from "../../../where/types";
import { Filter } from "./Filter";
import type { QueryASTContext } from "../QueryASTContext";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTNode } from "../QueryASTNode";
export declare class RelationshipFilter extends Filter {
    protected targetNodeFilters: Filter[];
    protected relationship: RelationshipAdapter;
    protected operator: RelationshipWhereOperator;
    protected isNot: boolean;
    protected subqueryPredicate: Cypher.Predicate | undefined;
    /** Variable to be used if relationship need to get the count (i.e. 1-1 relationships) */
    protected countVariable: Cypher.Variable;
    constructor({
        relationship,
        operator,
        isNot,
    }: {
        relationship: RelationshipAdapter;
        operator: RelationshipWhereOperator;
        isNot: boolean;
    });
    getChildren(): QueryASTNode[];
    addTargetNodeFilter(...filter: Filter[]): void;
    print(): string;
    protected getNestedContext(context: QueryASTContext): QueryASTContext;
    protected getNestedSelectionSubqueries(context: QueryASTContext): Cypher.Clause[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getNestedSubqueries(context: QueryASTContext): Cypher.Clause[];
    private getSubqueryForAllFilter;
    private getNestedSubqueryFilter;
    protected shouldCreateOptionalMatch(): boolean;
    getSelection(queryASTContext: QueryASTContext): Array<Cypher.Match | Cypher.With>;
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected getSingleRelationshipOperation({
        pattern,
        queryASTContext,
        innerPredicate,
    }: {
        pattern: Cypher.Pattern;
        queryASTContext: QueryASTContext;
        innerPredicate: Cypher.Predicate;
    }): Cypher.Predicate;
    protected createRelationshipOperation(
        pattern: Cypher.Pattern,
        queryASTContext: QueryASTContext
    ): Cypher.Predicate | undefined;
    protected wrapInNotIfNeeded(predicate: Cypher.Predicate): Cypher.Predicate;
}
//# sourceMappingURL=RelationshipFilter.d.ts.map
