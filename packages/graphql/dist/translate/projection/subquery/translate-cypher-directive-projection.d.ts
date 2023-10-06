import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Node } from "../../../classes";
import type { CypherField, CypherFieldReferenceMap } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
interface Res {
    projection: Cypher.Expr[];
    params: any;
    subqueries: Array<Cypher.Clause>;
    subqueriesBeforeSort: Array<Cypher.Clause>;
    predicates: Cypher.Predicate[];
}
export declare function translateCypherDirectiveProjection({
    context,
    cypherField,
    field,
    node,
    alias,
    nodeRef,
    res,
    cypherFieldAliasMap,
}: {
    context: Neo4jGraphQLTranslationContext;
    cypherField: CypherField;
    field: ResolveTree;
    node: Node;
    nodeRef: Cypher.Node;
    alias: string;
    res: Res;
    cypherFieldAliasMap: CypherFieldReferenceMap;
}): Res;
export {};
//# sourceMappingURL=translate-cypher-directive-projection.d.ts.map
