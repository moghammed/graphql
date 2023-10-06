import type { PointField, PrimitiveField } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
/** Translates an atomic comparison operation (e.g. "this0 <= $param0") */
export declare function createComparisonOperation({
    operator,
    propertyRefOrCoalesce,
    param,
    durationField,
    pointField,
}: {
    operator: string | undefined;
    propertyRefOrCoalesce: Cypher.Property | Cypher.Function | Cypher.Variable;
    param: Cypher.Param | Cypher.Property | Cypher.Function;
    durationField: PrimitiveField | undefined;
    pointField: PointField | undefined;
}): Cypher.ComparisonOp;
export declare function createBaseOperation({
    operator,
    target,
    value,
}: {
    operator: string;
    target: Cypher.Expr;
    value: Cypher.Expr;
}): Cypher.ComparisonOp;
//# sourceMappingURL=create-comparison-operation.d.ts.map
