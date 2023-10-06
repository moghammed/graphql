import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { AuthorizationOperation } from "../../../types/authorization";
import type { AuthFilterFactory } from "./AuthFilterFactory";
import { AuthorizationFilters } from "../ast/filters/authorization-filters/AuthorizationFilters";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
export declare class AuthorizationFactory {
    private filterFactory;
    constructor(filterFactory: AuthFilterFactory);
    createEntityAuthFilters(
        entity: ConcreteEntityAdapter,
        operations: AuthorizationOperation[],
        context: Neo4jGraphQLTranslationContext
    ): AuthorizationFilters | undefined;
    createAttributeAuthFilters(
        attribute: AttributeAdapter,
        entity: ConcreteEntityAdapter,
        operations: AuthorizationOperation[],
        context: Neo4jGraphQLTranslationContext
    ): AuthorizationFilters | undefined;
    private createAuthFilterRule;
}
//# sourceMappingURL=AuthorizationFactory.d.ts.map
