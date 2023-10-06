import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
/** Translates a property into its predicate filter */
export declare function createParameterWhere({
    key,
    value,
    context,
}: {
    key: string;
    value: any;
    context: Neo4jGraphQLTranslationContext;
}): Cypher.Predicate | undefined;
//# sourceMappingURL=create-parameter-where.d.ts.map
