import type { GraphQLWhereArg } from "../../types";
export declare const SubscriptionsAuthorizationAnnotationArguments: readonly ["filter"];
export declare const SubscriptionsAuthorizationFilterEventRule: readonly [
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP"
];
export type SubscriptionsAuthorizationFilterEvent = (typeof SubscriptionsAuthorizationFilterEventRule)[number];
export type SubscriptionsAuthorizationWhere = {
    AND?: SubscriptionsAuthorizationWhere[];
    OR?: SubscriptionsAuthorizationWhere[];
    NOT?: SubscriptionsAuthorizationWhere;
    jwt?: GraphQLWhereArg;
    node?: GraphQLWhereArg;
    relationship?: GraphQLWhereArg;
};
export declare class SubscriptionsAuthorizationAnnotation {
    filter?: SubscriptionsAuthorizationFilterRule[];
    constructor({ filter }: { filter?: SubscriptionsAuthorizationFilterRule[] });
}
export type SubscriptionsAuthorizationFilterRuleConstructor = {
    events?: SubscriptionsAuthorizationFilterEvent[];
    requireAuthentication?: boolean;
    where: SubscriptionsAuthorizationWhere;
};
export declare class SubscriptionsAuthorizationFilterRule {
    events: SubscriptionsAuthorizationFilterEvent[];
    requireAuthentication: boolean;
    where: SubscriptionsAuthorizationWhere;
    constructor({ events, requireAuthentication, where }: SubscriptionsAuthorizationFilterRuleConstructor);
}
//# sourceMappingURL=SubscriptionsAuthorizationAnnotation.d.ts.map
