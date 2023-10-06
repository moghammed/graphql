import type { ResolveTree } from "graphql-parse-resolve-info";
import Cypher from "@neo4j/cypher-builder";
import type { ConnectionField, CypherFieldReferenceMap } from "../../types";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function createConnectionClause({
    resolveTree,
    field,
    context,
    nodeVariable,
    returnVariable,
    cypherFieldAliasMap,
}: {
    resolveTree: ResolveTree;
    field: ConnectionField;
    context: Neo4jGraphQLTranslationContext;
    nodeVariable: Cypher.Node;
    returnVariable: Cypher.Variable;
    cypherFieldAliasMap: CypherFieldReferenceMap;
}): Cypher.Clause;
//# sourceMappingURL=create-connection-clause.d.ts.map
