import type { DirectiveNode } from "graphql";
import type { SchemaComposer } from "graphql-compose";
import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
export declare function generateSubscriptionTypes({
    schemaComposer,
    schemaModel,
    userDefinedFieldDirectivesForNode,
}: {
    schemaComposer: SchemaComposer;
    schemaModel: Neo4jGraphQLSchemaModel;
    userDefinedFieldDirectivesForNode: Map<string, Map<string, DirectiveNode[]>>;
}): void;
//# sourceMappingURL=generate-subscription-types.d.ts.map
