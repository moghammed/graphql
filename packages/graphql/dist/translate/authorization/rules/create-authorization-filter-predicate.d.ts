import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../../../classes";
import type { AuthorizationFilterRule } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { PredicateReturn } from "../../../types";
import type { AuthorizationOperation } from "../../../types/authorization";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createAuthorizationFilterPredicate({
    context,
    node,
    rules,
    variable,
    operations,
}: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    rules: AuthorizationFilterRule[];
    variable: string | Cypher.Node;
    operations: AuthorizationOperation[];
}): PredicateReturn;
//# sourceMappingURL=create-authorization-filter-predicate.d.ts.map
