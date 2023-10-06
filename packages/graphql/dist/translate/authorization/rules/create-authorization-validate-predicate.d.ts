import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../../../classes";
import type { AuthorizationValidateRule } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { PredicateReturn } from "../../../types";
import type { AuthorizationOperation, AuthorizationValidateWhen } from "../../../types/authorization";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createAuthorizationValidatePredicate({
    when,
    context,
    node,
    rules,
    variable,
    operations,
    conditionForEvaluation,
}: {
    when: AuthorizationValidateWhen;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    rules: AuthorizationValidateRule[];
    variable: string | Cypher.Node;
    operations: AuthorizationOperation[];
    conditionForEvaluation?: Cypher.Predicate;
}): PredicateReturn | undefined;
//# sourceMappingURL=create-authorization-validate-predicate.d.ts.map
