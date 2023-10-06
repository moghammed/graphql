import type { Neo4jGraphQLSchemaModel } from "../../../schema-model/Neo4jGraphQLSchemaModel";
import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConcreteEntity } from "../../../schema-model/entity/ConcreteEntity";
import { QueryAST } from "../ast/QueryAST";
import { OperationsFactory } from "./OperationFactory";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare class QueryASTFactory {
    schemaModel: Neo4jGraphQLSchemaModel;
    operationsFactory: OperationsFactory;
    constructor(schemaModel: Neo4jGraphQLSchemaModel);
    createQueryAST(resolveTree: ResolveTree, entity: ConcreteEntity, context: Neo4jGraphQLTranslationContext): QueryAST;
}
//# sourceMappingURL=QueryASTFactory.d.ts.map
