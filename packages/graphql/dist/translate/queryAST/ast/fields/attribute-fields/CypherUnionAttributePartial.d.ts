import type { ConcreteEntityAdapter } from "../../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import { QueryASTNode } from "../../QueryASTNode";
import type { Field } from "../Field";
import Cypher from "@neo4j/cypher-builder";
export declare class CypherUnionAttributePartial extends QueryASTNode {
    protected fields: Field[];
    protected target: ConcreteEntityAdapter;
    constructor({ fields, target }: { fields: Field[]; target: ConcreteEntityAdapter });
    getChildren(): QueryASTNode[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getProjectionExpression(variable: Cypher.Variable): Cypher.Expr;
    getFilterPredicate(variable: Cypher.Variable): Cypher.Predicate;
    private setSubqueriesProjection;
}
//# sourceMappingURL=CypherUnionAttributePartial.d.ts.map
