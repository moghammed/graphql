import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import { QueryASTContext } from "../ast/QueryASTContext";
import type { Field } from "../ast/fields/Field";
import type { CypherUnionAttributePartial } from "../ast/fields/attribute-fields/CypherUnionAttributePartial";
export declare class CypherAnnotationSubqueryGenerator {
    private attribute;
    private context;
    private cypherAnnotation;
    private columnName;
    private returnVariable;
    constructor({ context, attribute }: { context: QueryASTContext; attribute: AttributeAdapter });
    createSubqueryForCypherAnnotation({
        rawArguments,
        extraParams,
        nestedFields,
        subqueries,
        projectionFields,
    }: {
        rawArguments?: Record<string, any>;
        extraParams?: Record<string, any>;
        nestedFields?: Field[];
        subqueries?: Cypher.Clause[];
        projectionFields?: Record<string, string>;
    }): Cypher.Clause;
    createSubqueryForCypherAnnotationUnion({
        rawArguments,
        extraParams,
        nestedFields,
        subqueries,
        unionPartials,
    }: {
        rawArguments?: Record<string, any>;
        extraParams?: Record<string, any>;
        nestedFields?: Field[];
        subqueries?: Cypher.Clause[];
        unionPartials: CypherUnionAttributePartial[];
    }): Cypher.CompositeClause;
    private createCypherStatementSubquery;
    private replaceArgumentsInStatement;
    private getNestedFieldsSubquery;
    private getProjectionExpression;
    private getProjectionExpressionForUnionPartials;
    private getNestedFieldsProjectionMap;
    private getFieldsProjectionMap;
}
//# sourceMappingURL=CypherAnnotationSubqueryGenerator.d.ts.map
