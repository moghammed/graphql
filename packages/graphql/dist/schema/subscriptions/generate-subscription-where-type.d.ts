import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function generateSubscriptionWhereType(
    entityAdapter: ConcreteEntityAdapter,
    schemaComposer: SchemaComposer
): InputTypeComposer | undefined;
export declare function generateSubscriptionConnectionWhereType({
    entityAdapter,
    schemaComposer,
}: {
    entityAdapter: ConcreteEntityAdapter;
    schemaComposer: SchemaComposer;
}):
    | {
          created: InputTypeComposer;
          deleted: InputTypeComposer;
      }
    | undefined;
//# sourceMappingURL=generate-subscription-where-type.d.ts.map
