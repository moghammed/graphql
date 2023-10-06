import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import { ReadOperation } from "../ReadOperation";
import type { OperationTranspileOptions, OperationTranspileResult } from "../operations";
export declare class CompositeReadPartial extends ReadOperation {
    transpile({ returnVariable, context }: OperationTranspileOptions): OperationTranspileResult;
    private transpileNestedCompositeRelationship;
    protected getProjectionClause(context: QueryASTContext, returnVariable: Cypher.Variable): Cypher.Return;
}
//# sourceMappingURL=CompositeReadPartial.d.ts.map
