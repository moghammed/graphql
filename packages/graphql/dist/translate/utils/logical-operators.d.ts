import Cypher from "@neo4j/cypher-builder";
import { LOGICAL_OPERATORS } from "../../constants";
export type LogicalOperator = (typeof LOGICAL_OPERATORS)[number];
export declare function getLogicalPredicate(
    graphQLOperator: LogicalOperator,
    predicates: Cypher.Predicate[]
): Cypher.Predicate | undefined;
export declare function isLogicalOperator(key: string): key is LogicalOperator;
//# sourceMappingURL=logical-operators.d.ts.map
