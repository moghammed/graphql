import type { ObjectTypeDefinitionNode, EnumTypeDefinitionNode, InputObjectTypeDefinitionNode } from "graphql";
import { GraphQLEnumType } from "graphql";
export declare const AUTHORIZATION_VALIDATE_STAGE: GraphQLEnumType;
export declare const AUTHORIZATION_VALIDATE_OPERATION: GraphQLEnumType;
export declare const AUTHORIZATION_FILTER_OPERATION: GraphQLEnumType;
export declare const AUTHENTICATION_OPERATION: GraphQLEnumType;
export declare function getStaticAuthorizationDefinitions(
    JWTPayloadDefinition?: ObjectTypeDefinitionNode
): Array<InputObjectTypeDefinitionNode | EnumTypeDefinitionNode>;
//# sourceMappingURL=static-definitions.d.ts.map
