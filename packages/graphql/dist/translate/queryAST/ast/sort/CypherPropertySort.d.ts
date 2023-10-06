import type Cypher from "@neo4j/cypher-builder";
import type { SortField } from "./Sort";
import { Sort } from "./Sort";
import type { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTNode } from "../QueryASTNode";
import type { QueryASTContext } from "../QueryASTContext";
export declare class CypherPropertySort extends Sort {
    private attribute;
    private direction;
    constructor({ attribute, direction }: { attribute: AttributeAdapter; direction: Cypher.Order });
    getChildren(): QueryASTNode[];
    print(): string;
    getSortFields(
        context: QueryASTContext,
        variable: Cypher.Variable | Cypher.Property,
        sortByDatabaseName?: boolean
    ): SortField[];
    getProjectionField(context: QueryASTContext): string | Record<string, Cypher.Expr>;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
}
//# sourceMappingURL=CypherPropertySort.d.ts.map
