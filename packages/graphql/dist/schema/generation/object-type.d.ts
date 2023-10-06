import type { DirectiveNode } from "graphql";
import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function withObjectType({
    concreteEntityAdapter,
    userDefinedFieldDirectives,
    userDefinedObjectDirectives,
    composer,
}: {
    concreteEntityAdapter: ConcreteEntityAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    userDefinedObjectDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): ObjectTypeComposer;
//# sourceMappingURL=object-type.d.ts.map
