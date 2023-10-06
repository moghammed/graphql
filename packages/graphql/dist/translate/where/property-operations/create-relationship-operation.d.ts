import type { GraphQLWhereArg, RelationField, PredicateReturn } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
import type { WhereOperator } from "../types";
import type { Node, Relationship } from "../../../classes";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createRelationshipOperation({
    relationField,
    context,
    parentNode,
    operator,
    value,
    isNot,
    useExistExpr,
    checkParameterExistence,
}: {
    relationField: RelationField;
    context: Neo4jGraphQLTranslationContext;
    parentNode: Cypher.Node;
    operator: string | undefined;
    value: GraphQLWhereArg;
    isNot: boolean;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
export declare function createRelationPredicate({
    targetNode,
    targetPattern,
    targetRelationship,
    parentNode,
    refNode,
    context,
    relationField,
    whereInput,
    whereOperator,
    refEdge,
    useExistExpr,
    checkParameterExistence,
}: {
    parentNode: Cypher.Node;
    targetNode: Cypher.Node;
    targetPattern: Cypher.Pattern;
    targetRelationship: Cypher.Relationship;
    refNode: Node;
    context: Neo4jGraphQLTranslationContext;
    relationField: RelationField;
    whereInput: GraphQLWhereArg;
    whereOperator: WhereOperator;
    refEdge?: Relationship;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
//# sourceMappingURL=create-relationship-operation.d.ts.map
