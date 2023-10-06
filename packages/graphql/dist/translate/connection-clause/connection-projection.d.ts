import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConnectionField, CypherFieldReferenceMap } from "../../types";
import type { Node } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function createEdgeProjection({
    resolveTree,
    field,
    relationshipRef,
    relatedNodeVariableName,
    context,
    relatedNode,
    resolveType,
    extraFields,
    cypherFieldAliasMap,
}: {
    resolveTree: ResolveTree;
    field: ConnectionField;
    relationshipRef: Cypher.Relationship;
    relatedNodeVariableName: Cypher.Node;
    context: Neo4jGraphQLTranslationContext;
    relatedNode: Node;
    resolveType?: boolean;
    extraFields?: Array<string>;
    cypherFieldAliasMap: CypherFieldReferenceMap;
}): {
    projection: Cypher.Map;
    subqueries: Cypher.Clause[];
    predicates: Cypher.Predicate[];
};
//# sourceMappingURL=connection-projection.d.ts.map
