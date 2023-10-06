import Cypher from "@neo4j/cypher-builder";
import { Filter } from "../Filter";
import type { CountFilter } from "./CountFilter";
import type { AggregationPropertyFilter } from "./AggregationPropertyFilter";
import type { LogicalFilter } from "../LogicalFilter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class AggregationFilter extends Filter {
    private relationship;
    private filters;
    private subqueryReturnVariable;
    constructor(relationship: RelationshipAdapter);
    addFilters(...filter: Array<AggregationPropertyFilter | CountFilter | LogicalFilter>): void;
    getChildren(): QueryASTNode[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getPredicate(_queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
}
//# sourceMappingURL=AggregationFilter.d.ts.map
