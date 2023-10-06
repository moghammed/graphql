import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConnectionField, ConnectionWhereArg, CypherFieldReferenceMap } from "../../types";
import type { Node } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
/** Create the match, filtering and projection of the edge and the nested node */
export declare function createEdgeSubquery({
    resolveTree,
    field,
    context,
    parentNode,
    relatedNode,
    returnVariable,
    whereInput,
    resolveType,
    ignoreSort,
    cypherFieldAliasMap,
}: {
    resolveTree: ResolveTree;
    field: ConnectionField;
    context: Neo4jGraphQLTranslationContext;
    parentNode: Cypher.Node;
    relatedNode: Node;
    returnVariable: Cypher.Variable;
    whereInput: ConnectionWhereArg;
    resolveType?: boolean;
    ignoreSort?: boolean;
    cypherFieldAliasMap: CypherFieldReferenceMap;
}): Cypher.Clause | undefined;
//# sourceMappingURL=create-edge-subquery.d.ts.map
