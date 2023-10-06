import type { FieldDirective, InterfaceDirective, ObjectDirective } from "../../../constants";
type InvalidFieldCombinations = Record<FieldDirective, ReadonlyArray<FieldDirective | "private">>;
export declare const invalidFieldCombinations: InvalidFieldCombinations;
type InvalidInterfaceCombinations = Record<InterfaceDirective, ReadonlyArray<InterfaceDirective>>;
export declare const invalidInterfaceCombinations: InvalidInterfaceCombinations;
type InvalidObjectCombinations = Record<Exclude<ObjectDirective, "jwt">, ReadonlyArray<ObjectDirective>>;
export declare const invalidObjectCombinations: InvalidObjectCombinations;
export {};
//# sourceMappingURL=invalid-directive-combinations.d.ts.map
