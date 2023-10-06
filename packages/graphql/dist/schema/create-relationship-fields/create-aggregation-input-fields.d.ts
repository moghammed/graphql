import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function createAggregationInputFields(
    entity: ConcreteEntityAdapter | RelationshipAdapter,
    rel: RelationshipAdapter,
    schemaComposer: SchemaComposer
): InputTypeComposer | undefined;
//# sourceMappingURL=create-aggregation-input-fields.d.ts.map