import Cypher from "@neo4j/cypher-builder";
import type { FilterOperator } from "../Filter";
import { Filter } from "../Filter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class PropertyFilter extends Filter {
    protected attribute: AttributeAdapter;
    protected comparisonValue: unknown;
    protected operator: FilterOperator;
    protected isNot: boolean;
    protected attachedTo: "node" | "relationship";
    constructor({
        attribute,
        comparisonValue,
        operator,
        isNot,
        attachedTo,
    }: {
        attribute: AttributeAdapter;
        comparisonValue: unknown;
        operator: FilterOperator;
        isNot: boolean;
        attachedTo?: "node" | "relationship";
    });
    getChildren(): QueryASTNode[];
    print(): string;
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate;
    private getPropertyRef;
    /** Returns the operation for a given filter.
     * To be overridden by subclasses
     */
    protected getOperation(prop: Cypher.Property): Cypher.ComparisonOp;
    /** Returns the default operation for a given filter */
    protected createBaseOperation({
        operator,
        property,
        param,
    }: {
        operator: FilterOperator;
        property: Cypher.Expr;
        param: Cypher.Expr;
    }): Cypher.ComparisonOp;
    protected coalesceValueIfNeeded(expr: Cypher.Expr): Cypher.Expr;
    private getNullPredicate;
    private wrapInNotIfNeeded;
}
//# sourceMappingURL=PropertyFilter.d.ts.map
