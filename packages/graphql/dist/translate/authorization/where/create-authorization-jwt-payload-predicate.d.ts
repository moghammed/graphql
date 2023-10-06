import Cypher from "@neo4j/cypher-builder";
import type { GraphQLWhereArg } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createJwtPayloadWherePredicate({
    where,
    context,
}: {
    where: GraphQLWhereArg;
    context: Neo4jGraphQLTranslationContext;
}): Cypher.Predicate | undefined;
//# sourceMappingURL=create-authorization-jwt-payload-predicate.d.ts.map
