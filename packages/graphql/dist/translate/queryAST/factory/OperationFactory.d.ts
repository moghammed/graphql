import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import { AggregationOperation } from "../ast/operations/AggregationOperation";
import { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import { ReadOperation } from "../ast/operations/ReadOperation";
import { CompositeConnectionReadOperation } from "../ast/operations/composite/CompositeConnectionReadOperation";
import { CompositeReadOperation } from "../ast/operations/composite/CompositeReadOperation";
import type { QueryASTFactory } from "./QueryASTFactory";
export declare class OperationsFactory {
    private filterFactory;
    private fieldFactory;
    private sortAndPaginationFactory;
    private authorizationFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createReadOperation(
        entityOrRel: ConcreteEntityAdapter | RelationshipAdapter,
        resolveTree: ResolveTree,
        context: Neo4jGraphQLTranslationContext
    ): ReadOperation | CompositeReadOperation;
    createAggregationOperation(
        relationship: RelationshipAdapter,
        resolveTree: ResolveTree,
        context: Neo4jGraphQLTranslationContext
    ): AggregationOperation;
    createConnectionOperationAST(
        relationship: RelationshipAdapter,
        resolveTree: ResolveTree,
        context: Neo4jGraphQLTranslationContext
    ): ConnectionReadOperation | CompositeConnectionReadOperation;
    private hydrateConnectionOperationsASTWithSort;
    private findFieldsByNameInResolveTree;
    private hydrateConnectionOperationAST;
    private splitConnectionFields;
    private hydrateReadOperation;
    private getOptions;
    private getConnectionOptions;
    private createAttributeAuthFilters;
    private hydrateCompositeReadOperationWithPagination;
}
//# sourceMappingURL=OperationFactory.d.ts.map
