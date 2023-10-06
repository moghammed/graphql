import Cypher from "@neo4j/cypher-builder";
import type { ReadOperation } from "./operations/ReadOperation";
import type { Neo4jGraphQLContext } from "../../../types/neo4j-graphql-context";
export declare class QueryAST {
    private operation;
    constructor(operation: ReadOperation);
    transpile(neo4jGraphQLContext: Neo4jGraphQLContext): Cypher.Clause;
    print(): string;
}
//# sourceMappingURL=QueryAST.d.ts.map
