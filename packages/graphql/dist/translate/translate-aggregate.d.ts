import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../classes";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
declare function translateAggregate({
    node,
    context,
}: {
    node: Node;
    context: Neo4jGraphQLTranslationContext;
}): [Cypher.Clause, any];
export default translateAggregate;
//# sourceMappingURL=translate-aggregate.d.ts.map
