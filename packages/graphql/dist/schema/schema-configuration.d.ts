import type { ObjectTypeDefinitionNode, SchemaExtensionNode } from "graphql";
import type { Exclude } from "../classes";
import type { MutationDirective } from "../classes/MutationDirective";
import type { QueryDirective } from "../classes/QueryDirective";
import type { SubscriptionDirective } from "../classes/SubscriptionDirective";
export type SchemaConfiguration = {
    queryDirective?: QueryDirective;
    mutationDirective?: MutationDirective;
    subscriptionDirective?: SubscriptionDirective;
};
export type SchemaConfigurationFlags = {
    read: boolean;
    aggregate: boolean;
    create: boolean;
    delete: boolean;
    update: boolean;
    subscribeCreate: boolean;
    subscribeUpdate: boolean;
    subscribeDelete: boolean;
    subscribeCreateRelationship: boolean;
    subscribeDeleteRelationship: boolean;
};
export declare function schemaConfigurationFromSchemaExtensions(
    schemaExtensions: SchemaExtensionNode[]
): SchemaConfiguration;
export declare function schemaConfigurationFromObjectTypeDefinition(
    definition: ObjectTypeDefinitionNode
): SchemaConfiguration;
export declare function getSchemaConfigurationFlags(options: {
    nodeSchemaConfiguration?: SchemaConfiguration;
    globalSchemaConfiguration?: SchemaConfiguration;
    excludeDirective?: Exclude;
}): SchemaConfigurationFlags;
//# sourceMappingURL=schema-configuration.d.ts.map
