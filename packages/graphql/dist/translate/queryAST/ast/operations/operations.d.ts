import type Cypher from "@neo4j/cypher-builder";
import { QueryASTNode } from "../QueryASTNode";
import type { QueryASTContext } from "../QueryASTContext";
export type OperationTranspileOptions = {
    returnVariable: Cypher.Variable;
    context: QueryASTContext;
};
export type OperationTranspileResult = {
    projectionExpr: Cypher.Expr;
    clauses: Cypher.Clause[];
};
export declare abstract class Operation extends QueryASTNode {
    abstract transpile(options: OperationTranspileOptions): OperationTranspileResult;
}
//# sourceMappingURL=operations.d.ts.map
