import type { DirectiveNode } from "graphql";
import type { Directive, InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withConnectOrCreateFieldInputType({
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
export declare function withConnectOrCreateInputType({
    relationshipAdapter,
    composer,
    userDefinedFieldDirectives,
    deprecatedDirectives,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    deprecatedDirectives: Directive[];
}): InputTypeComposer | undefined;
//# sourceMappingURL=connect-or-create-input.d.ts.map