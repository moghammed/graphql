import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import { Filter } from "../Filter";
import type { AuthorizationRuleFilter } from "./AuthorizationRuleFilter";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class AuthorizationFilters extends Filter {
    private validationFilters;
    private whereFilters;
    constructor({
        validationFilters,
        whereFilters,
    }: {
        validationFilters: AuthorizationRuleFilter[];
        whereFilters: AuthorizationRuleFilter[];
    });
    addValidationFilter(filter: AuthorizationRuleFilter): void;
    addWhereFilter(filter: AuthorizationRuleFilter): void;
    getPredicate(context: QueryASTContext): Cypher.Predicate | undefined;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getSelection(context: QueryASTContext): Array<Cypher.Match | Cypher.With>;
    getChildren(): QueryASTNode[];
}
//# sourceMappingURL=AuthorizationFilters.d.ts.map
