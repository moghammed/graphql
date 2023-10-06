import Cypher from "@neo4j/cypher-builder";
import { AttributeField } from "./AttributeField";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { Field } from "../Field";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class CypherAttributeField extends AttributeField {
    protected customCypherVar: Cypher.Node;
    protected projection: Record<string, string> | undefined;
    protected nestedFields: Field[] | undefined;
    protected rawArguments: Record<string, any>;
    protected extraParams: Record<string, any>;
    constructor({
        alias,
        attribute,
        projection,
        nestedFields,
        rawArguments,
        extraParams,
    }: {
        alias: string;
        attribute: AttributeAdapter;
        projection?: Record<string, string>;
        nestedFields?: Field[];
        rawArguments: Record<string, any>;
        extraParams: Record<string, any>;
    });
    getChildren(): QueryASTNode[];
    getProjectionField(_variable: Cypher.Variable): string | Record<string, Cypher.Expr>;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
}
//# sourceMappingURL=CypherAttributeField.d.ts.map
