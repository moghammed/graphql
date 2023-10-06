import type { InterfaceEntityAdapter } from "./InterfaceEntityAdapter";
type RootTypeFieldNames = {
    create: string;
    read: string;
    update: string;
    delete: string;
    aggregate: string;
    subscribe: {
        created: string;
        updated: string;
        deleted: string;
        relationship_created: string;
        relationship_deleted: string;
    };
};
type FulltextTypeNames = {
    result: string;
    where: string;
    sort: string;
};
type AggregateTypeNames = {
    selection: string;
    input: string;
};
type MutationResponseTypeNames = {
    create: string;
    update: string;
};
type SubscriptionEvents = {
    create: string;
    update: string;
    delete: string;
    create_relationship: string;
    delete_relationship: string;
};
export type UpdateMutationArgumentNames = {
    connect: string;
    disconnect: string;
    create: string;
    update: string;
    delete: string;
    connectOrCreate: string;
    where: string;
};
export type CreateMutationArgumentNames = {
    input: string;
};
export declare class InterfaceEntityOperations {
    private readonly InterfaceEntityAdapter;
    private readonly pascalCasePlural;
    private readonly pascalCaseSingular;
    constructor(InterfaceEntityAdapter: InterfaceEntityAdapter);
    get whereInputTypeName(): string;
    get whereOnImplementationsWhereInputTypeName(): string;
    get uniqueWhereInputTypeName(): string;
    get connectOrCreateWhereInputTypeName(): string;
    get connectWhereInputTypeName(): string;
    get createInputTypeName(): string;
    get updateInputTypeName(): string;
    get whereOnImplementationsUpdateInputTypeName(): string;
    get deleteInputTypeName(): string;
    get whereOnImplementationsDeleteInputTypeName(): string;
    get optionsInputTypeName(): string;
    get fullTextInputTypeName(): string;
    get sortInputTypeName(): string;
    get relationInputTypeName(): string;
    get connectInputTypeName(): string;
    get connectOrCreateInputTypeName(): string;
    get whereOnImplementationsConnectInputTypeName(): string;
    get disconnectInputTypeName(): string;
    get whereOnImplementationsDisconnectInputTypeName(): string;
    get onCreateInputTypeName(): string;
    get subscriptionWhereInputTypeName(): string;
    get subscriptionEventPayloadTypeName(): string;
    get implementationsSubscriptionWhereInputTypeName(): string;
    get rootTypeFieldNames(): RootTypeFieldNames;
    get fulltextTypeNames(): FulltextTypeNames;
    get aggregateTypeNames(): AggregateTypeNames;
    get mutationResponseTypeNames(): MutationResponseTypeNames;
    get subscriptionEventTypeNames(): SubscriptionEvents;
    get subscriptionEventPayloadFieldNames(): SubscriptionEvents;
    get updateMutationArgumentNames(): UpdateMutationArgumentNames;
    get createMutationArgumentNames(): CreateMutationArgumentNames;
    get connectOrCreateWhereInputFieldNames(): {
        node: string;
    };
}
export {};
//# sourceMappingURL=InterfaceEntityOperations.d.ts.map
