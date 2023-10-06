import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare enum FieldAggregationSchemaTypes {
    field = "AggregationSelection",
    node = "NodeAggregateSelection",
    edge = "EdgeAggregateSelection",
}
export declare class FieldAggregationComposer {
    private aggregationTypesMapper;
    private composer;
    constructor(composer: SchemaComposer, subgraph?: Subgraph);
    private createAggregationField;
    createAggregationTypeObject(relationshipAdapter: RelationshipAdapter): ObjectTypeComposer;
    private getAggregationFields;
}
//# sourceMappingURL=field-aggregation-composer.d.ts.map
