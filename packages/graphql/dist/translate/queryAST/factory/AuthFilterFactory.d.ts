import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import { FilterFactory } from "./FilterFactory";
import type { RelationshipWhereOperator, WhereOperator } from "../../where/types";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipFilter } from "../ast/filters/RelationshipFilter";
import type { Filter } from "../ast/filters/Filter";
import type { GraphQLWhereArg } from "../../../types";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { AuthorizationOperation } from "../../../types/authorization";
import { PropertyFilter } from "../ast/filters/property-filters/PropertyFilter";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare class AuthFilterFactory extends FilterFactory {
    createAuthFilters({
        entity,
        operations,
        context,
        populatedWhere,
    }: {
        entity: ConcreteEntityAdapter;
        operations: AuthorizationOperation[];
        context: Neo4jGraphQLTranslationContext;
        populatedWhere: GraphQLWhereArg;
    }): Filter[];
    private createJWTFilters;
    protected createPropertyFilter({
        attribute,
        comparisonValue,
        operator,
        isNot,
        attachedTo,
    }: {
        attribute: AttributeAdapter;
        comparisonValue: unknown;
        operator: WhereOperator | undefined;
        isNot: boolean;
        attachedTo?: "node" | "relationship";
    }): PropertyFilter;
    protected createRelationshipFilterTreeNode(options: {
        relationship: RelationshipAdapter;
        isNot: boolean;
        operator: RelationshipWhereOperator;
    }): RelationshipFilter;
}
//# sourceMappingURL=AuthFilterFactory.d.ts.map
