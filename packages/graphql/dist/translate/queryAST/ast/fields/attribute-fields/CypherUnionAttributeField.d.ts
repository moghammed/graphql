import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { CypherAttributeField } from "./CypherAttributeField";
import type { CypherUnionAttributePartial } from "./CypherUnionAttributePartial";
export declare class CypherUnionAttributeField extends CypherAttributeField {
    protected unionPartials: CypherUnionAttributePartial[];
    constructor({
        alias,
        attribute,
        projection,
        unionPartials,
        rawArguments,
        extraParams,
    }: {
        alias: string;
        attribute: AttributeAdapter;
        projection?: Record<string, string>;
        unionPartials: CypherUnionAttributePartial[];
        rawArguments: Record<string, any>;
        extraParams: Record<string, any>;
    });
    getChildren(): QueryASTNode[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
}
//# sourceMappingURL=CypherUnionAttributeField.d.ts.map
