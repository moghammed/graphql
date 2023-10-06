import type { PredicateReturn } from "../../types";
import type { Node } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export type AggregationAuth = {
    params: Record<string, string>;
    whereQuery: string;
};
export declare function createFieldAggregationAuth({
    node,
    context,
    subqueryNodeAlias,
}: {
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    subqueryNodeAlias: Cypher.Node;
}): PredicateReturn | undefined;
//# sourceMappingURL=field-aggregations-auth.d.ts.map
