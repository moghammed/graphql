import type { DirectiveNode } from "graphql";
import type { Directive, InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withCreateInputType({
    entityAdapter,
    userDefinedFieldDirectives,
    composer,
}: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter | RelationshipAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    composer: SchemaComposer;
}): InputTypeComposer;
export declare function augmentCreateInputTypeWithRelationshipsInput({
    relationshipAdapter,
    composer,
    userDefinedFieldDirectives,
    deprecatedDirectives,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    deprecatedDirectives: Directive[];
}): void;
export declare function withFieldInputType({
    relationshipAdapter,
    composer,
    userDefinedFieldDirectives,
    ifUnionMemberEntity,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    ifUnionMemberEntity?: ConcreteEntityAdapter;
}): InputTypeComposer | undefined;
//# sourceMappingURL=create-input.d.ts.map