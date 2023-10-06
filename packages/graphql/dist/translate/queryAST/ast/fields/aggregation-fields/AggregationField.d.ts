import { Field } from "../Field";
import type Cypher from "@neo4j/cypher-builder";
export declare abstract class AggregationField extends Field {
    getProjectionField(_variable: Cypher.Variable): Record<string, Cypher.Expr>;
    abstract getAggregationExpr(variable: Cypher.Variable): Cypher.Expr;
    abstract getAggregationProjection(target: Cypher.Variable, returnVar: Cypher.Variable): Cypher.Clause;
}
//# sourceMappingURL=AggregationField.d.ts.map
