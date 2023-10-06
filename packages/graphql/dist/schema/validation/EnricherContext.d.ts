import type {
    DocumentNode,
    GraphQLSchema,
    TypeDefinitionNode,
    DirectiveDefinitionNode,
    ObjectTypeExtensionNode,
    InterfaceTypeExtensionNode,
} from "graphql";
export type DefinitionNodeMap = Record<
    string,
    TypeDefinitionNode | DirectiveDefinitionNode | ObjectTypeExtensionNode[] | InterfaceTypeExtensionNode[]
>;
export declare class EnricherContext {
    augmentedSchema: GraphQLSchema;
    userDefinitionNodeMap: DefinitionNodeMap;
    constructor(userDocument: DocumentNode, augmentedDocument: DocumentNode);
    buildDefinitionsNodeMap(documentNode: DocumentNode): DefinitionNodeMap;
}
//# sourceMappingURL=EnricherContext.d.ts.map