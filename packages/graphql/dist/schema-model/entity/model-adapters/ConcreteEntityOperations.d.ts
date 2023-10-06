import type { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
type RootTypeFieldNames = {
    create: string;
    read: string;
    update: string;
    delete: string;
    aggregate: string;
    connection: string;
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
export declare class ConcreteEntityOperations {
    private readonly concreteEntityAdapter;
    private readonly pascalCasePlural;
    private readonly pascalCaseSingular;
    constructor(concreteEntityAdapter: ConcreteEntityAdapter);
    get whereInputTypeName(): string;
    get uniqueWhereInputTypeName(): string;
    get connectOrCreateWhereInputTypeName(): string;
    get connectWhereInputTypeName(): string;
    get createInputTypeName(): string;
    get updateInputTypeName(): string;
    get deleteInputTypeName(): string;
    get optionsInputTypeName(): string;
    get fullTextInputTypeName(): string;
    getFullTextIndexInputTypeName(indexName: string): string;
    getFullTextIndexQueryFieldName(indexName: string): string;
    get sortInputTypeName(): string;
    get relationInputTypeName(): string;
    get connectInputTypeName(): string;
    get connectOrCreateInputTypeName(): string;
    get disconnectInputTypeName(): string;
    get onCreateInputTypeName(): string;
    get subscriptionEventPayloadTypeName(): string;
    get subscriptionWhereInputTypeName(): string;
    get relationshipsSubscriptionWhereInputTypeName(): string;
    get relationshipCreatedSubscriptionWhereInputTypeName(): string;
    get relationshipDeletedSubscriptionWhereInputTypeName(): string;
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
//# sourceMappingURL=ConcreteEntityOperations.d.ts.map
