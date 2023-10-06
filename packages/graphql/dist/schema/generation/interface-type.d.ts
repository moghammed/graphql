import type { DirectiveNode } from "graphql";
import type { InterfaceTypeComposer, SchemaComposer } from "graphql-compose";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withInterfaceType({
    entityAdapter,
    userDefinedFieldDirectives,
    userDefinedInterfaceDirectives,
    composer,
    config,
}: {
    entityAdapter: InterfaceEntityAdapter | RelationshipAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    userDefinedInterfaceDirectives: DirectiveNode[];
    composer: SchemaComposer;
    config?: {
        includeRelationships: boolean;
    };
}): InterfaceTypeComposer;
//# sourceMappingURL=interface-type.d.ts.map
