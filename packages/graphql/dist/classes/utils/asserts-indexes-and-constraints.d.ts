import type { Driver } from "neo4j-driver";
import type Node from "../Node";
import type { Neo4jGraphQLSessionConfig } from "../Executor";
export interface AssertIndexesAndConstraintsOptions {
    create?: boolean;
}
export declare function assertIndexesAndConstraints({
    driver,
    sessionConfig,
    nodes,
    options,
}: {
    driver: Driver;
    sessionConfig?: Neo4jGraphQLSessionConfig;
    nodes: Node[];
    options?: AssertIndexesAndConstraintsOptions;
}): Promise<void>;
//# sourceMappingURL=asserts-indexes-and-constraints.d.ts.map
