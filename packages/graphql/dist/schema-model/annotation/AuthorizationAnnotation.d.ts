import type { GraphQLWhereArg } from "../../types";
export declare const AuthorizationAnnotationArguments: readonly ["filter", "validate"];
export declare const AuthorizationFilterOperationRule: readonly [
    "READ",
    "AGGREGATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP"
];
export declare const AuthorizationValidateOperationRule: readonly [
    "READ",
    "AGGREGATE",
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP"
];
export type AuthorizationFilterOperation = (typeof AuthorizationFilterOperationRule)[number];
export type AuthorizationValidateOperation = (typeof AuthorizationValidateOperationRule)[number];
export type ValidateWhen = "BEFORE" | "AFTER";
export type AuthorizationWhere = {
    AND?: AuthorizationWhere[];
    OR?: AuthorizationWhere[];
    NOT?: AuthorizationWhere;
    jwt?: GraphQLWhereArg;
    node?: GraphQLWhereArg;
};
export declare class AuthorizationAnnotation {
    filter?: AuthorizationFilterRule[];
    validate?: AuthorizationValidateRule[];
    constructor({ filter, validate }: { filter?: AuthorizationFilterRule[]; validate?: AuthorizationValidateRule[] });
}
export type AuthorizationFilterRuleConstructor = {
    operations?: AuthorizationFilterOperation[];
    requireAuthentication?: boolean;
    where: AuthorizationWhere;
};
export declare class AuthorizationFilterRule {
    operations: AuthorizationFilterOperation[];
    requireAuthentication: boolean;
    where: AuthorizationWhere;
    constructor({ operations, requireAuthentication, where }: AuthorizationFilterRuleConstructor);
}
export type AuthorizationValidateRuleConstructor = {
    operations?: AuthorizationValidateOperation[];
    requireAuthentication?: boolean;
    where: AuthorizationWhere;
    when?: ValidateWhen[];
};
export declare class AuthorizationValidateRule {
    operations: AuthorizationValidateOperation[];
    requireAuthentication: boolean;
    where: AuthorizationWhere;
    when: ValidateWhen[];
    constructor({ operations, requireAuthentication, where, when }: AuthorizationValidateRuleConstructor);
}
//# sourceMappingURL=AuthorizationAnnotation.d.ts.map
