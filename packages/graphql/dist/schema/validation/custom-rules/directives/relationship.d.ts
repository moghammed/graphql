import type {
    DirectiveNode,
    FieldDefinitionNode,
    EnumTypeDefinitionNode,
    InterfaceTypeDefinitionNode,
    UnionTypeDefinitionNode,
    InterfaceTypeExtensionNode,
} from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "../utils/path-parser";
export declare function verifyRelationshipArgumentValue(
    objectTypeToRelationshipsPerRelationshipTypeMap: Map<string, Map<string, [string, string, string][]>>,
    interfaceToImplementationsMap: Map<string, Set<string>>,
    extra?: {
        enums: EnumTypeDefinitionNode[];
        interfaces: (InterfaceTypeDefinitionNode | InterfaceTypeExtensionNode)[];
        unions: UnionTypeDefinitionNode[];
    }
): ({
    directiveNode,
    traversedDef,
    parentDef,
}: {
    directiveNode: DirectiveNode;
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
    parentDef?: ObjectOrInterfaceWithExtensions | undefined;
}) => void;
export declare function verifyRelationshipFieldType({
    traversedDef,
}: {
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
}): void;
//# sourceMappingURL=relationship.d.ts.map
