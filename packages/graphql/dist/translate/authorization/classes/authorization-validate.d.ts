import type { AuthorizationValidateOperation } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { AuthorizationValidateWhen } from "../../../types/authorization";
export declare class AuthorizationValidate {
    operations: AuthorizationValidateOperation[];
    when: AuthorizationValidateWhen;
    constructor({
        operations,
        when,
    }: {
        operations: AuthorizationValidateOperation[];
        when: AuthorizationValidateWhen;
    });
}
//# sourceMappingURL=authorization-validate.d.ts.map
