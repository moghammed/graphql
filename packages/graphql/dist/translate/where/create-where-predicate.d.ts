import type { GraphQLWhereArg, PredicateReturn } from "../../types";
import type { GraphElement } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
/** Translate a target node and GraphQL input into a Cypher operation or valid where expression */
export declare function createWherePredicate({
    targetElement,
    whereInput,
    context,
    element,
    useExistExpr,
    checkParameterExistence,
}: {
    targetElement: Cypher.Variable;
    whereInput: GraphQLWhereArg;
    context: Neo4jGraphQLTranslationContext;
    element: GraphElement;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
//# sourceMappingURL=create-where-predicate.d.ts.map
