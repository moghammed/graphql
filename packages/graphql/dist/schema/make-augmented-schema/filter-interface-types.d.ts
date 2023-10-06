import type { InterfaceTypeDefinitionNode } from "graphql";
export declare function filterInterfaceTypes(
    interfaceTypes: InterfaceTypeDefinitionNode[],
    relationshipPropertyInterfaceNames: Set<string>,
    interfaceRelationshipNames: Set<string>
): {
    relationshipProperties: InterfaceTypeDefinitionNode[];
    interfaceRelationships: InterfaceTypeDefinitionNode[];
    filteredInterfaceTypes: InterfaceTypeDefinitionNode[];
};
//# sourceMappingURL=filter-interface-types.d.ts.map