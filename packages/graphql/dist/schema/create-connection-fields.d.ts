import { type DirectiveNode } from "graphql";
import type { InterfaceTypeComposer, ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import { Relationship } from "../classes";
import { ConcreteEntityAdapter } from "../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { ObjectFields } from "./get-obj-field-meta";
export declare function createConnectionFields({
    entityAdapter,
    schemaComposer,
    composeNode,
    userDefinedFieldDirectives,
    relationshipFields,
}: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    schemaComposer: SchemaComposer;
    composeNode: ObjectTypeComposer | InterfaceTypeComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    relationshipFields: Map<string, ObjectFields>;
}): Relationship[];
//# sourceMappingURL=create-connection-fields.d.ts.map
