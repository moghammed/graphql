import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { Operation } from "../operations/operations";
import { Field } from "./Field";
import Cypher from "@neo4j/cypher-builder";
export declare class OperationField extends Field {
    private operation;
    private projectionExpr;
    constructor({ operation, alias }: { operation: Operation; alias: string });
    getChildren(): QueryASTNode[];
    getProjectionField(): Record<string, Cypher.Expr>;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
}
//# sourceMappingURL=OperationField.d.ts.map
