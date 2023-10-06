import type { Directive, InputTypeComposerFieldConfigMapDefinition } from "graphql-compose";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function augmentWhereInputTypeWithRelationshipFields(
    relationshipAdapter: RelationshipAdapter,
    deprecatedDirectives: Directive[]
): InputTypeComposerFieldConfigMapDefinition;
export declare function augmentWhereInputTypeWithConnectionFields(
    relationshipAdapter: RelationshipAdapter,
    deprecatedDirectives: Directive[]
): InputTypeComposerFieldConfigMapDefinition;
//# sourceMappingURL=augment-where-input.d.ts.map
