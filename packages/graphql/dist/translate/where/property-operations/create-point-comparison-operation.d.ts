import type { PointField } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
/** Translates a point comparison operation */
export declare function createPointComparisonOperation({
    operator,
    propertyRefOrCoalesce,
    param,
    pointField,
}: {
    operator: string | undefined;
    propertyRefOrCoalesce: Cypher.Property | Cypher.Function | Cypher.Variable;
    param: Cypher.Param | Cypher.Property;
    pointField: PointField;
}): Cypher.ComparisonOp;
//# sourceMappingURL=create-point-comparison-operation.d.ts.map
