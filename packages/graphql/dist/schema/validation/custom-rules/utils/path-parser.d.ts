import type {
    ASTNode,
    ObjectTypeDefinitionNode,
    FieldDefinitionNode,
    InterfaceTypeDefinitionNode,
    ObjectTypeExtensionNode,
    InterfaceTypeExtensionNode,
} from "graphql";
export type ObjectOrInterfaceWithExtensions =
    | ObjectTypeDefinitionNode
    | InterfaceTypeDefinitionNode
    | ObjectTypeExtensionNode
    | InterfaceTypeExtensionNode;
export declare function getPathToNode(
    path: readonly (number | string)[],
    ancenstors: readonly (ASTNode | readonly ASTNode[])[]
): [
    Array<string>,
    ObjectOrInterfaceWithExtensions | FieldDefinitionNode | undefined,
    ObjectOrInterfaceWithExtensions | undefined
];
//# sourceMappingURL=path-parser.d.ts.map
