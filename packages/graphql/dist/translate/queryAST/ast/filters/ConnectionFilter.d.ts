import Cypher from "@neo4j/cypher-builder";
import type { RelationshipWhereOperator } from "../../../where/types";
import { Filter } from "./Filter";
import type { QueryASTContext } from "../QueryASTContext";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTNode } from "../QueryASTNode";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
export declare class ConnectionFilter extends Filter {
    private innerFilters;
    private relationship;
    private target;
    private operator;
    private isNot;
    private subqueryPredicate;
    constructor({
        relationship,
        target,
        operator,
        isNot,
    }: {
        relationship: RelationshipAdapter;
        target: ConcreteEntityAdapter | InterfaceEntityAdapter;
        operator: RelationshipWhereOperator | undefined;
        isNot: boolean;
    });
    addFilters(filters: Filter[]): void;
    getChildren(): QueryASTNode[];
    print(): string;
    private getTargetNode;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    /**
     * Create a label predicate that filters concrete entities for interface target,
     * so that the same pattern matching can be used for all the concrete entities implemented by the interface entity.
     * Example:
     * MATCH (this:Actor)
     * WHERE EXISTS {
     *    MATCH (this)<-[this0:ACTED_IN]-(this1)
     *    WHERE (this1.title = $param0 AND (this1:Movie OR this1:Show)
     * }
     * RETURN this { .name } AS this
     **/
    private getLabelPredicate;
    private createRelationshipOperation;
    private createSingleRelationshipOperation;
    private getSubqueriesForDefaultOperations;
    private getSubqueriesForOperationAll;
    private wrapInNotIfNeeded;
}
//# sourceMappingURL=ConnectionFilter.d.ts.map
