import Cypher from "@neo4j/cypher-builder";
import type { Relationship } from "../classes";
import type { GraphQLWhereArg, PredicateReturn, RelationField } from "../types";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
type WhereFilter = Record<string, any>;
export type AggregateWhereInput = {
    count: number;
    count_LT: number;
    count_LTE: number;
    count_GT: number;
    count_GTE: number;
    node: WhereFilter;
    edge: WhereFilter;
} & WhereFilter;
export declare function aggregatePreComputedWhereFields({
    value,
    relationField,
    relationship,
    context,
    matchNode,
}: {
    value: GraphQLWhereArg;
    relationField: RelationField;
    relationship: Relationship | undefined;
    context: Neo4jGraphQLTranslationContext;
    matchNode: Cypher.Variable;
}): PredicateReturn;
export {};
//# sourceMappingURL=create-aggregate-where-and-params.d.ts.map
