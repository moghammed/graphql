import type { Node } from "../../../classes";
import type { GraphQLOptionsArg, GraphQLWhereArg, RelationField } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
import type { CypherRelationshipDirection } from "../../../utils/get-relationship-direction";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createProjectionSubquery({
    parentNode,
    whereInput,
    node,
    context,
    subqueryReturnAlias,
    nestedProjection,
    nestedSubqueries,
    targetNode,
    relationField,
    relationshipDirection,
    optionsInput,
    nestedPredicates,
    addSkipAndLimit,
    collect,
}: {
    parentNode: Cypher.Node;
    whereInput?: GraphQLWhereArg;
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    nestedProjection: Cypher.Expr;
    nestedSubqueries: Cypher.Clause[];
    targetNode: Cypher.Node;
    subqueryReturnAlias: Cypher.Variable;
    relationField: RelationField;
    relationshipDirection: CypherRelationshipDirection;
    optionsInput: GraphQLOptionsArg;
    nestedPredicates?: Cypher.Predicate[];
    addSkipAndLimit?: boolean;
    collect?: boolean;
}): Cypher.Clause;
//# sourceMappingURL=create-projection-subquery.d.ts.map
