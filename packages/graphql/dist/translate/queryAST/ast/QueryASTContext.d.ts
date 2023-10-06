import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLContext } from "../../../types/neo4j-graphql-context";
type Scope = Map<string, Cypher.Variable>;
export declare class QueryASTEnv {
    private scopes;
    getScope(element: Cypher.Node | Cypher.Relationship): Scope;
}
export declare class QueryASTContext {
    readonly target: Cypher.Node;
    readonly relationship?: Cypher.Relationship;
    readonly source?: Cypher.Node;
    env: QueryASTEnv;
    neo4jGraphQLContext: Neo4jGraphQLContext;
    constructor({
        target,
        relationship,
        source,
        env,
        neo4jGraphQLContext,
    }: {
        target: Cypher.Node;
        relationship?: Cypher.Relationship;
        source?: Cypher.Node;
        env?: QueryASTEnv;
        neo4jGraphQLContext: Neo4jGraphQLContext;
    });
    getRelationshipScope(): Scope;
    getTargetScope(): Scope;
    getScopeVariable(name: string): Cypher.Variable;
    push({ relationship, target }: { relationship: Cypher.Relationship; target: Cypher.Node }): QueryASTContext;
}
export {};
//# sourceMappingURL=QueryASTContext.d.ts.map
