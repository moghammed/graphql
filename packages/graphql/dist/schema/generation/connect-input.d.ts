import type { Directive, InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withConnectInputType({
    entityAdapter,
    composer,
}: {
    entityAdapter: InterfaceEntityAdapter | ConcreteEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function augmentConnectInputTypeWithConnectFieldInput({
    relationshipAdapter,
    composer,
    deprecatedDirectives,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    deprecatedDirectives: Directive[];
}): void;
export declare function withConnectFieldInputType({
    relationshipAdapter,
    composer,
    ifUnionMemberEntity,
}: {
    relationshipAdapter: RelationshipAdapter;
    composer: SchemaComposer;
    ifUnionMemberEntity?: ConcreteEntityAdapter;
}): InputTypeComposer | undefined;
//# sourceMappingURL=connect-input.d.ts.map