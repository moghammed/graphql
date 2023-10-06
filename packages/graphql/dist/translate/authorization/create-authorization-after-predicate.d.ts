import Cypher from "@neo4j/cypher-builder";
import type { PredicateReturn } from "../../types";
import type { AuthorizationOperation } from "../../types/authorization";
import type { NodeMap } from "./types/node-map";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function createAuthorizationAfterPredicate({
    context,
    nodes,
    operations,
    conditionForEvaluation,
}: {
    context: Neo4jGraphQLTranslationContext;
    nodes: NodeMap[];
    operations: AuthorizationOperation[];
    conditionForEvaluation?: Cypher.Predicate;
}): PredicateReturn | undefined;
//# sourceMappingURL=create-authorization-after-predicate.d.ts.map
