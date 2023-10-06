import type { DirectiveNode } from "graphql";
import type { Directive, InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withRelationInputType({
    relationshipAdapter,
    composer,
    deprecatedDirectives,
    userDefinedFieldDirectives,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    deprecatedDirectives: Directive[];
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): InputTypeComposer | undefined;
export declare function withCreateFieldInputType({
    relationshipAdapter,
    composer,
    ifUnionMemberEntity,
    userDefinedFieldDirectives,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    ifUnionMemberEntity?: ConcreteEntityAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): InputTypeComposer | undefined;
//# sourceMappingURL=relation-input.d.ts.map
