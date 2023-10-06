import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConnectionWhereArg, GraphQLWhereArg } from "../../../types";
import type { RelationshipWhereOperator, WhereOperator } from "../../where/types";
import { ConnectionFilter } from "../ast/filters/ConnectionFilter";
import type { Filter } from "../ast/filters/Filter";
import { RelationshipFilter } from "../ast/filters/RelationshipFilter";
import { PropertyFilter } from "../ast/filters/property-filters/PropertyFilter";
import type { QueryASTFactory } from "./QueryASTFactory";
export declare class FilterFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    /**
     * Get all the entities explicitly required by the where "on" object. If it's a concrete entity it will return itself.
     **/
    private filterConcreteEntities;
    createConnectionFilter(
        relationship: RelationshipAdapter,
        where: ConnectionWhereArg,
        filterOps: {
            isNot: boolean;
            operator: RelationshipWhereOperator | undefined;
        }
    ): ConnectionFilter[];
    createConnectionPredicates(
        rel: RelationshipAdapter,
        entity: ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter,
        where: GraphQLWhereArg | GraphQLWhereArg[]
    ): Filter[];
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
    private createRelationshipFilter;
    protected createRelationshipFilterTreeNode(options: {
        relationship: RelationshipAdapter;
        isNot: boolean;
        operator: RelationshipWhereOperator;
    }): RelationshipFilter;
    private getConcretePredicate;
    createNodeFilters(
        entity: ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter,
        where: Record<string, unknown>
    ): Filter[];
    private createEdgeFilters;
    private createNodeLogicalFilter;
    private createEdgeLogicalFilter;
    private getAggregationNestedFilters;
    private createAggregationFilter;
    private createAggregationNodeFilters;
    private wrapMultipleFiltersInLogical;
    private createAggregateLogicalFilter;
}
//# sourceMappingURL=FilterFactory.d.ts.map
