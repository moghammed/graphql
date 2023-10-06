import type { DirectiveNode } from "graphql";
import type { InterfaceTypeComposer, SchemaComposer } from "graphql-compose";
import { ObjectTypeComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
export declare function createRelationshipFields({
    entityAdapter,
    schemaComposer,
    composeNode,
    subgraph,
    userDefinedFieldDirectives,
}: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    schemaComposer: SchemaComposer;
    composeNode: ObjectTypeComposer | InterfaceTypeComposer;
    subgraph?: Subgraph;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): void;
//# sourceMappingURL=create-relationship-fields.d.ts.map
