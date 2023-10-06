import Cypher from "@neo4j/cypher-builder";
import type { ConnectionField, ConnectionWhereArg, PredicateReturn } from "../../../types";
import type { Node, Relationship } from "../../../classes";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createConnectionOperation({
    connectionField,
    value,
    context,
    parentNode,
    operator,
    useExistExpr,
    checkParameterExistence,
}: {
    connectionField: ConnectionField;
    value: any;
    context: Neo4jGraphQLTranslationContext;
    parentNode: Cypher.Node;
    operator: string | undefined;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
export declare function createConnectionWherePropertyOperation({
    context,
    whereInput,
    edgeRef,
    targetNode,
    node,
    edge,
    useExistExpr,
    checkParameterExistence,
}: {
    whereInput: ConnectionWhereArg;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    edge: Relationship;
    edgeRef: Cypher.Variable;
    targetNode: Cypher.Node;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
/** Checks if a where property has an explicit interface inside _on */
export declare function hasExplicitNodeInInterfaceWhere({
    whereInput,
    node,
}: {
    whereInput: ConnectionWhereArg;
    node: Node;
}): boolean;
//# sourceMappingURL=create-connection-operation.d.ts.map
