import type { DirectiveNode } from "graphql";
import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function createConnectOrCreateField({
    relationshipAdapter,
    targetEntityAdapter, // TODO: take this from relationshipAdapter.target in the end, currently here bc unions call this function for reach refNode
    schemaComposer,
    userDefinedFieldDirectives,
}: {
    relationshipAdapter: RelationshipAdapter;
    targetEntityAdapter: ConcreteEntityAdapter;
    schemaComposer: SchemaComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): string | undefined;
export declare function createOnCreateITC({
    schemaComposer,
    relationshipAdapter,
    targetEntityAdapter,
    userDefinedFieldDirectives,
}: {
    schemaComposer: SchemaComposer;
    relationshipAdapter: RelationshipAdapter;
    targetEntityAdapter: ConcreteEntityAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): InputTypeComposer;
//# sourceMappingURL=create-connect-or-create-field.d.ts.map
