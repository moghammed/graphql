import type { GraphQLSchema, ObjectTypeDefinitionNode } from "graphql";
import type { ObjectFields } from "../../../schema/get-obj-field-meta";
export declare function getJwtFields(
    schema: GraphQLSchema,
    JWTPayloadDefinition?: ObjectTypeDefinitionNode
): Pick<ObjectFields, "scalarFields" | "primitiveFields" | "enumFields" | "temporalFields" | "pointFields">;
export declare function getStandardJwtDefinition(schema: GraphQLSchema): ObjectTypeDefinitionNode;
//# sourceMappingURL=jwt-payload.d.ts.map