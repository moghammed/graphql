import type { Neo4jStruct } from "../../types";
import type Node from "../../classes/Node";
type FormatterOptions = {
    getNodeLabel?: (node: Node) => string;
    sanitizeRelType?: (relType: string) => string;
};
export default function graphqlFormatter(
    neo4jStruct: Neo4jStruct,
    readonly?: boolean,
    options?: FormatterOptions
): string;
export {};
//# sourceMappingURL=graphql.d.ts.map
