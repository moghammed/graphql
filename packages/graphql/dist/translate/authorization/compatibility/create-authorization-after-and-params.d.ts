import type { Node } from "../../../types";
import type { AuthorizationOperation } from "../../../types/authorization";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export type AuthorizationAfterAndParams = {
    cypher: string;
    params: Record<string, any>;
    subqueries?: string;
};
type StringNodeMap = {
    node: Node;
    variable: string;
    fieldName?: string;
};
export declare function createAuthorizationAfterAndParams({
    context,
    nodes,
    operations,
}: {
    context: Neo4jGraphQLTranslationContext;
    nodes: StringNodeMap[];
    operations: AuthorizationOperation[];
}): AuthorizationAfterAndParams | undefined;
export {};
//# sourceMappingURL=create-authorization-after-and-params.d.ts.map
