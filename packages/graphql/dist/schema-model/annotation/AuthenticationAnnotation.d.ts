import type { GraphQLWhereArg } from "../../types";
export type AuthenticationOperation =
    | "READ"
    | "AGGREGATE"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "CREATE_RELATIONSHIP"
    | "DELETE_RELATIONSHIP"
    | "SUBSCRIBE";
export declare class AuthenticationAnnotation {
    readonly operations: Set<AuthenticationOperation>;
    readonly jwt?: GraphQLWhereArg;
    constructor(operations: AuthenticationOperation[], jwt?: GraphQLWhereArg);
}
//# sourceMappingURL=AuthenticationAnnotation.d.ts.map
