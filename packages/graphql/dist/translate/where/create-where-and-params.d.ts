import type { GraphQLWhereArg } from "../../types";
import type { Node } from "../../classes";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
/** Wraps createCypherWhereParams with the old interface for compatibility with old way of composing cypher */
export default function createWhereAndParams({
    whereInput,
    varName,
    chainStr,
    node,
    context,
    recursing,
}: {
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    whereInput: GraphQLWhereArg;
    varName: string;
    chainStr?: string;
    recursing?: boolean;
}): [string, string, any];
//# sourceMappingURL=create-where-and-params.d.ts.map
