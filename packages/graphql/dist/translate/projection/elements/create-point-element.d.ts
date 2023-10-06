import Cypher from "@neo4j/cypher-builder";
import type { ResolveTree } from "graphql-parse-resolve-info";
import type { PointField } from "../../../types";
export default function createPointElement({
    resolveTree,
    field,
    variable,
}: {
    resolveTree: ResolveTree;
    field: PointField;
    variable: Cypher.Node | Cypher.Variable;
}): Cypher.Expr;
export declare function createPointExpression({
    resolveTree,
    field,
    variable,
}: {
    resolveTree: ResolveTree;
    field: PointField;
    variable: Cypher.Variable;
}): Cypher.Expr;
//# sourceMappingURL=create-point-element.d.ts.map
