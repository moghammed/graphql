import type { CallbackBucket } from "../../../classes/CallbackBucket";
import type { Visitor, ICreateAST, INestedCreateAST, IAST } from "../GraphQLInputAST/GraphQLInputAST";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
type UnwindCreateScopeDefinition = {
    unwindVar: Cypher.Variable;
    parentVar: Cypher.Variable;
    clause?: Cypher.Clause;
};
type GraphQLInputASTNodeRef = string;
type UnwindCreateEnvironment = Record<GraphQLInputASTNodeRef, UnwindCreateScopeDefinition>;
export declare class UnwindCreateVisitor implements Visitor {
    unwindVar: Cypher.Variable;
    callbackBucket: CallbackBucket;
    context: Neo4jGraphQLTranslationContext;
    rootNode: Cypher.Node | undefined;
    clause: Cypher.Clause | undefined;
    environment: UnwindCreateEnvironment;
    constructor(unwindVar: Cypher.Variable, callbackBucket: CallbackBucket, context: Neo4jGraphQLTranslationContext);
    visitChildren(
        currentASTNode: IAST,
        unwindVar: Cypher.Variable,
        parentVar: Cypher.Variable
    ): (Cypher.Clause | undefined)[];
    visitCreate(create: ICreateAST): void;
    visitNestedCreate(nestedCreate: INestedCreateAST): void;
    private getAuthNodeClause;
    private getAuthorizationFieldClause;
    build(): [Cypher.Node?, Cypher.Clause?];
}
export {};
//# sourceMappingURL=UnwindCreateVisitor.d.ts.map
