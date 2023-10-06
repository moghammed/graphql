import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { AggregationLogicalOperator, AggregationOperator } from "../../../factory/parsers/parse-where-field";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { Filter } from "../Filter";
export declare class AggregationPropertyFilter extends Filter {
    protected attribute: AttributeAdapter;
    protected comparisonValue: unknown;
    protected logicalOperator: AggregationLogicalOperator;
    protected aggregationOperator: AggregationOperator | undefined;
    protected attachedTo: "node" | "relationship";
    constructor({
        attribute,
        logicalOperator,
        comparisonValue,
        aggregationOperator,
        attachedTo,
    }: {
        attribute: AttributeAdapter;
        logicalOperator: AggregationLogicalOperator;
        comparisonValue: unknown;
        aggregationOperator: AggregationOperator | undefined;
        attachedTo?: "node" | "relationship";
    });
    getChildren(): QueryASTNode[];
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected getOperation(expr: Cypher.Expr): Cypher.ComparisonOp;
    private getPropertyRef;
    private getAggregateOperation;
    /** Returns the default operation for a given filter */
    protected createBaseOperation({
        operator,
        property,
        param,
    }: {
        operator: AggregationLogicalOperator;
        property: Cypher.Expr;
        param: Cypher.Expr;
    }): Cypher.ComparisonOp;
}
//# sourceMappingURL=AggregationPropertyFilter.d.ts.map
