import type { ResolveTree } from "graphql-parse-resolve-info";
import { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import type { Field } from "../ast/fields/Field";
import type { AggregationField } from "../ast/fields/aggregation-fields/AggregationField";
import type { QueryASTFactory } from "./QueryASTFactory";
export declare class FieldFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createFields(
        entity: ConcreteEntityAdapter | RelationshipAdapter,
        rawFields: Record<string, ResolveTree>,
        context: Neo4jGraphQLTranslationContext
    ): Field[];
    private createRelationshipAggregationField;
    createAggregationFields(
        entity: ConcreteEntityAdapter | RelationshipAdapter,
        rawFields: Record<string, ResolveTree>
    ): AggregationField[];
    private getRequiredResolveTree;
    private createAttributeField;
    private createCypherAttributeField;
    private createConnectionField;
    private createRelationshipField;
}
//# sourceMappingURL=FieldFactory.d.ts.map
