import Cypher from "@neo4j/cypher-builder";
/** Checks if provided variable is a Cypher.Node instance */
export declare function isCypherNode(variable: Cypher.Variable): variable is Cypher.Node;
/** Asserts the given variable is a Cypher.Node instance */
export declare function assertIsCypherNode(variable: Cypher.Variable): asserts variable is Cypher.Node;
//# sourceMappingURL=is-cypher-node.d.ts.map
