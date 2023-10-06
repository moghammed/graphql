import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
export declare function makeImplementationsDisconnectInput({
    interfaceEntityAdapter,
    composer,
}: {
    interfaceEntityAdapter: InterfaceEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function makeImplementationsConnectInput({
    interfaceEntityAdapter,
    composer,
}: {
    interfaceEntityAdapter: InterfaceEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function makeImplementationsDeleteInput({
    interfaceEntityAdapter,
    composer,
}: {
    interfaceEntityAdapter: InterfaceEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function makeImplementationsUpdateInput({
    interfaceEntityAdapter,
    composer,
}: {
    interfaceEntityAdapter: InterfaceEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer;
export declare function makeImplementationsWhereInput({
    interfaceEntityAdapter,
    composer,
}: {
    interfaceEntityAdapter: InterfaceEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer;
//# sourceMappingURL=implementation-inputs.d.ts.map
