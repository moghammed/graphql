import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
export declare class AggregationTypesMapper {
    private requiredAggregationSelectionTypes;
    private nullableAggregationSelectionTypes;
    private subgraph;
    constructor(composer: SchemaComposer, subgraph?: Subgraph);
    getAggregationType({
        fieldName,
        nullable,
    }: {
        fieldName: string;
        nullable: boolean;
    }): ObjectTypeComposer<unknown, unknown> | undefined;
    private getOrCreateAggregationSelectionTypes;
    private createType;
    private makeNullable;
}
//# sourceMappingURL=aggregation-types-mapper.d.ts.map