import type {
    AuthorizationFilterRule,
    AuthorizationValidateRule,
} from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { AuthorizationOperation } from "../../../types/authorization";
export declare function findMatchingRules(
    rules: AuthorizationFilterRule[],
    operations: AuthorizationOperation[]
): AuthorizationFilterRule[];
export declare function findMatchingRules(
    rules: AuthorizationValidateRule[],
    operations: AuthorizationOperation[]
): AuthorizationValidateRule[];
//# sourceMappingURL=find-matching-rules.d.ts.map
