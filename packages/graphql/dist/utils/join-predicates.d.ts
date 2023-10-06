export declare const PREDICATE_JOINS: readonly ["AND", "OR"];
export type PredicateJoin = (typeof PREDICATE_JOINS)[number];
export declare function isPredicateJoin(value: string): value is PredicateJoin;
export default function joinPredicates(predicates: string[], joinType: PredicateJoin): string;
//# sourceMappingURL=join-predicates.d.ts.map