import type { Node } from "../../classes";
import type { ConcreteEntity } from "../../schema-model/entity/ConcreteEntity";
import type { AuthenticationOperation } from "../../schema-model/annotation/AuthenticationAnnotation";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function checkAuthentication({
    context,
    node,
    targetOperations,
    field,
}: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    targetOperations: AuthenticationOperation[];
    field?: string;
}): void;
export declare function checkEntityAuthentication({
    context,
    entity,
    targetOperations,
    field,
}: {
    context: Neo4jGraphQLTranslationContext;
    entity: ConcreteEntity;
    targetOperations: AuthenticationOperation[];
    field?: string;
}): void;
//# sourceMappingURL=check-authentication.d.ts.map
