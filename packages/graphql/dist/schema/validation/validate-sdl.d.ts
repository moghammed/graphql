import type { Maybe } from "@graphql-tools/utils/typings/types";
import type { DocumentNode, GraphQLSchema, GraphQLError } from "graphql";
import type { SDLValidationRule } from "graphql/validation/ValidationContext";
export declare function validateSDL(
    documentAST: DocumentNode,
    rules: ReadonlyArray<SDLValidationRule>,
    schemaToExtend?: Maybe<GraphQLSchema>
): ReadonlyArray<GraphQLError>;
//# sourceMappingURL=validate-sdl.d.ts.map
