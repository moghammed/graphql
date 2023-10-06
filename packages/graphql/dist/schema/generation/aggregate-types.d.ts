import type { DirectiveNode } from "graphql";
import type { InputTypeComposer, ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { AggregationTypesMapper } from "../aggregations/aggregation-types-mapper";
export declare function withAggregateSelectionType({
    concreteEntityAdapter,
    aggregationTypesMapper,
    propagatedDirectives,
    composer,
}: {
    concreteEntityAdapter: ConcreteEntityAdapter;
    aggregationTypesMapper: AggregationTypesMapper;
    propagatedDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): ObjectTypeComposer;
export declare function withAggregateInputType({
    relationshipAdapter,
    entityAdapter, // TODO: this is relationshipAdapter.target but from the context above it is known to be ConcreteEntity and we don't know this yet!!!
    composer,
}: {
    relationshipAdapter: RelationshipAdapter;
    entityAdapter: ConcreteEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer;
//# sourceMappingURL=aggregate-types.d.ts.map
