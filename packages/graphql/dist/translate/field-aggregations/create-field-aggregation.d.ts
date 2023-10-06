import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Node } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function createFieldAggregation({
    context,
    nodeVar,
    node,
    field,
}: {
    context: Neo4jGraphQLTranslationContext;
    nodeVar: Cypher.Node;
    node: Node;
    field: ResolveTree;
}):
    | {
          projectionCypher: Cypher.Expr;
          projectionSubqueryCypher: Cypher.Clause | undefined;
      }
    | undefined;
//# sourceMappingURL=create-field-aggregation.d.ts.map
