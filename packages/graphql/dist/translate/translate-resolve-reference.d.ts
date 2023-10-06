import type { Node } from "../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateResolveReference({
    node,
    context,
    reference,
}: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    reference: any;
}): Cypher.CypherResult;
//# sourceMappingURL=translate-resolve-reference.d.ts.map
