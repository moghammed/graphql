import type { Node } from "../../../types";
import type { AuthorizationOperation } from "../../../types/authorization";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export type AuthorizationBeforeAndParams = {
    cypher: string;
    params: Record<string, any>;
    subqueries?: string;
};
type StringNodeMap = {
    node: Node;
    variable: string;
    fieldName?: string;
};
export declare function createAuthorizationBeforeAndParams({
    context,
    nodes,
    operations,
}: {
    context: Neo4jGraphQLTranslationContext;
    nodes: StringNodeMap[];
    operations: AuthorizationOperation[];
}): AuthorizationBeforeAndParams | undefined;
export {};
//# sourceMappingURL=create-authorization-before-and-params.d.ts.map
