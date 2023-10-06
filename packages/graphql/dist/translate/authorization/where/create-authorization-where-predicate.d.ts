import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../../../classes";
import type { AuthorizationWhere } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { PredicateReturn } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createAuthorizationWherePredicate({
    where,
    context,
    node,
    target,
}: {
    where: AuthorizationWhere;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    target: Cypher.Variable;
}): PredicateReturn;
//# sourceMappingURL=create-authorization-where-predicate.d.ts.map
