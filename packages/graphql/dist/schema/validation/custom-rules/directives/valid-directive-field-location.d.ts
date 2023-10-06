import type { ASTVisitor } from "graphql";
import type { SDLValidationContext } from "graphql/validation/ValidationContext";
/** only the @cypher directive is valid on fields of Root types: Query, Mutation; no directives valid on fields of Subscription */
export declare function ValidDirectiveAtFieldLocation(context: SDLValidationContext): ASTVisitor;
//# sourceMappingURL=valid-directive-field-location.d.ts.map
