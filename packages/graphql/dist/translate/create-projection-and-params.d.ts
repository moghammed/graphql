import type { ResolveTree } from "graphql-parse-resolve-info";
import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../classes";
import type { CypherFieldReferenceMap } from "../types";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export type ProjectionResult = {
    params: Record<string, any>;
    subqueriesBeforeSort: Array<Cypher.Clause>;
    subqueries: Array<Cypher.Clause>;
    predicates: Cypher.Predicate[];
    projection: Cypher.Expr;
};
export default function createProjectionAndParams({
    resolveTree,
    node,
    context,
    varName,
    literalElements,
    resolveType,
    cypherFieldAliasMap,
}: {
    resolveTree: ResolveTree;
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    varName: Cypher.Node;
    literalElements?: boolean;
    resolveType?: boolean;
    cypherFieldAliasMap: CypherFieldReferenceMap;
}): ProjectionResult;
//# sourceMappingURL=create-projection-and-params.d.ts.map
