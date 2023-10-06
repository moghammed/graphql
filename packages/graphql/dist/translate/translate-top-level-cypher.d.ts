import type { CypherField } from "../types";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateTopLevelCypher({
    context,
    field,
    args,
    type,
    statement,
}: {
    context: Neo4jGraphQLTranslationContext;
    field: CypherField;
    args: any;
    statement: string;
    type: "Query" | "Mutation";
}): Cypher.CypherResult;
//# sourceMappingURL=translate-top-level-cypher.d.ts.map
