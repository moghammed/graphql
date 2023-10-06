import type { PredicateReturn } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
import type { GraphElement } from "../../../classes";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
/** Translates a property into its predicate filter */
export declare function createPropertyWhere({
    key,
    value,
    element,
    targetElement,
    context,
    useExistExpr,
    checkParameterExistence,
}: {
    key: string;
    value: any;
    element: GraphElement;
    targetElement: Cypher.Variable;
    context: Neo4jGraphQLTranslationContext;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
//# sourceMappingURL=create-property-where.d.ts.map
