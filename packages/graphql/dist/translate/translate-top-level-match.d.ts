import type { GraphQLWhereArg } from "../types";
import type { Node } from "../classes";
import Cypher from "@neo4j/cypher-builder";
import type { AuthorizationOperation } from "../types/authorization";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateTopLevelMatch({
    matchNode,
    node,
    context,
    operation,
    where,
}: {
    matchNode: Cypher.Node;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    operation: AuthorizationOperation;
    where: GraphQLWhereArg | undefined;
}): Cypher.CypherResult;
type CreateMatchClauseReturn = {
    matchClause: Cypher.Match | Cypher.Yield;
    preComputedWhereFieldSubqueries: Cypher.CompositeClause | undefined;
    whereClause: Cypher.Match | Cypher.Yield | Cypher.With | undefined;
};
export declare function createMatchClause({
    matchNode,
    node,
    context,
    operation,
    where,
}: {
    matchNode: Cypher.Node;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    operation: AuthorizationOperation;
    where: GraphQLWhereArg | undefined;
}): CreateMatchClauseReturn;
export {};
//# sourceMappingURL=translate-top-level-match.d.ts.map
