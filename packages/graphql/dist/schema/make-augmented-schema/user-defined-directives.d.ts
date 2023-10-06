import type { DirectiveNode } from "graphql";
import type { DefinitionNodes } from "../get-definition-nodes";
/**
 * TODO [directive-inheritance]
 * should directives be inherited?? they are user-defined after all.
 * other considerations might apply to PROPAGATED_DIRECTIVES: deprecated and shareable
 * ATM we only test deprecated propagates
 */
export declare function getUserDefinedDirectives(definitionNodes: DefinitionNodes): {
    userDefinedFieldDirectivesForNode: Map<string, Map<string, DirectiveNode[]>>;
    userDefinedDirectivesForNode: Map<string, DirectiveNode[]>;
    propagatedDirectivesForNode: Map<string, DirectiveNode[]>;
    userDefinedDirectivesForInterface: Map<string, DirectiveNode[]>;
};
//# sourceMappingURL=user-defined-directives.d.ts.map
