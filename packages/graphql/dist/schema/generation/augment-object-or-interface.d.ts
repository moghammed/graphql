import type { DirectiveNode } from "graphql";
import type { Directive } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function augmentObjectOrInterfaceTypeWithRelationshipField(
    relationshipAdapter: RelationshipAdapter,
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>,
    subgraph?: Subgraph | undefined
): Record<
    string,
    {
        type: string;
        description?: string;
        directives: Directive[];
        args?: any;
    }
>;
//# sourceMappingURL=augment-object-or-interface.d.ts.map
