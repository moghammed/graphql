import type { Node } from "../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateRead(
    {
        node,
        context,
        isRootConnectionField,
        isGlobalNode,
    }: {
        context: Neo4jGraphQLTranslationContext;
        node: Node;
        isRootConnectionField?: boolean;
        isGlobalNode?: boolean;
    },
    varName?: string
): Cypher.CypherResult;
//# sourceMappingURL=translate-read.d.ts.map
