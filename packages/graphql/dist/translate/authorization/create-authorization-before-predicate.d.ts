import type { PredicateReturn } from "../../types";
import type { AuthorizationOperation } from "../../types/authorization";
import type { NodeMap } from "./types/node-map";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function createAuthorizationBeforePredicate({
    context,
    nodes,
    operations,
}: {
    context: Neo4jGraphQLTranslationContext;
    nodes: NodeMap[];
    operations: AuthorizationOperation[];
}): PredicateReturn | undefined;
//# sourceMappingURL=create-authorization-before-predicate.d.ts.map
