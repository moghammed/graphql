import type { Node } from "../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateDelete({
    context,
    node,
}: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
}): Cypher.CypherResult;
//# sourceMappingURL=translate-delete.d.ts.map
