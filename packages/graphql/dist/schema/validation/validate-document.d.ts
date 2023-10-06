import type {
    DocumentNode,
    ObjectTypeDefinitionNode,
    GraphQLDirective,
    GraphQLNamedType,
    EnumTypeDefinitionNode,
    InterfaceTypeDefinitionNode,
    UnionTypeDefinitionNode,
} from "graphql";
import type { Neo4jFeaturesSettings } from "../../types";
declare function validateDocument({
    document,
    features,
    additionalDefinitions,
}: {
    document: DocumentNode;
    features: Neo4jFeaturesSettings | undefined;
    additionalDefinitions: {
        additionalDirectives?: Array<GraphQLDirective>;
        additionalTypes?: Array<GraphQLNamedType>;
        enums?: EnumTypeDefinitionNode[];
        interfaces?: InterfaceTypeDefinitionNode[];
        unions?: UnionTypeDefinitionNode[];
        objects?: ObjectTypeDefinitionNode[];
    };
}): void;
export default validateDocument;
//# sourceMappingURL=validate-document.d.ts.map
