import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTNode } from "../../QueryASTNode";
import { AggregationField } from "./AggregationField";
export declare class AggregationAttributeField extends AggregationField {
    private attribute;
    constructor({ alias, attribute }: { alias: string; attribute: AttributeAdapter });
    getChildren(): QueryASTNode[];
    getProjectionField(variable: Cypher.Variable): Record<string, Cypher.Expr>;
    getAggregationExpr(variable: Cypher.Variable): Cypher.Expr;
    getAggregationProjection(target: Cypher.Variable, returnVar: Cypher.Variable): Cypher.Clause;
    private createDatetimeProjection;
}
//# sourceMappingURL=AggregationAttributeField.d.ts.map
