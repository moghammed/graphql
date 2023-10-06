import type { DirectiveNode } from "graphql";
import type { ObjectTypeComposer, SchemaComposer, InterfaceTypeComposer } from "graphql-compose";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function createRelationshipInterfaceFields({
    relationship,
    composeNode,
    schemaComposer,
    userDefinedFieldDirectives,
}: {
    relationship: RelationshipAdapter;
    composeNode: ObjectTypeComposer | InterfaceTypeComposer;
    schemaComposer: SchemaComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): void;
//# sourceMappingURL=create-relationship-interface-fields.d.ts.map
