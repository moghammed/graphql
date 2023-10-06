import Cypher from "@neo4j/cypher-builder";
import type { GraphQLWhereArg } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function populateWhereParams({
    where,
    context,
}: {
    where: GraphQLWhereArg;
    context: Neo4jGraphQLTranslationContext;
}): GraphQLWhereArg;
export declare function parseContextParamProperty(
    value: string,
    context: Neo4jGraphQLTranslationContext
): string | Cypher.Property | Cypher.Param;
//# sourceMappingURL=populate-where-params.d.ts.map
