import type { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "./RelationshipAdapter";
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
export declare class RelationshipOperations {
    private readonly relationship;
    constructor(relationship: RelationshipAdapter);
    get prefixForTypename(): string;
    get fieldInputPrefixForTypename(): string;
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename(): string;
    /**Note: Required for now to infer the types without ResolveTree */
    getAggregationFieldTypename(nestedField?: "node" | "edge"): string;
    getTargetTypePrettyName(): string;
    getConnectionUnionWhereInputTypename(concreteEntityAdapter: ConcreteEntityAdapter): string;
    get connectionSortInputTypename(): string;
    get connectionWhereInputTypename(): string;
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename(): string;
    getFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getToUnionFieldInputTypeName(ifUnionRelationshipTargetEntity: ConcreteEntityAdapter): string;
    getUpdateFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getCreateFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getDeleteFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getConnectFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getDisconnectFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getConnectOrCreateInputTypeName(): string;
    getConnectOrCreateFieldInputTypeName(concreteTargetEntityAdapter?: ConcreteEntityAdapter): string;
    getConnectOrCreateOnCreateFieldInputTypeName(concreteTargetEntityAdapter: ConcreteEntityAdapter): string;
    get connectionFieldName(): string;
    getConnectionWhereTypename(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getUpdateConnectionInputTypename(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    get aggregateInputTypeName(): string;
    get aggregateTypeName(): string;
    getAggregationWhereInputTypeName(isA: "Node" | "Edge"): string;
    get subscriptionWhereInputTypeName(): string;
    getToUnionSubscriptionWhereInputTypeName(ifUnionRelationshipTargetEntity: ConcreteEntityAdapter): string;
    get unionConnectInputTypeName(): string;
    get unionDeleteInputTypeName(): string;
    get unionDisconnectInputTypeName(): string;
    get unionCreateInputTypeName(): string;
    get unionCreateFieldInputTypeName(): string;
    get unionUpdateInputTypeName(): string;
    getToUnionUpdateInputTypeName(ifUnionRelationshipTargetEntity: ConcreteEntityAdapter): string;
    get subscriptionConnectedRelationshipTypeName(): string;
    get edgeCreateInputTypeName(): string;
    get createInputTypeName(): string;
    get edgeUpdateInputTypeName(): string;
    get whereInputTypeName(): string;
    get edgeSubscriptionWhereInputTypeName(): string;
    get sortInputTypeName(): string;
    getConnectOrCreateInputFields(target: ConcreteEntityAdapter): {
        where: string;
        onCreate: string;
    };
}
//# sourceMappingURL=RelationshipOperations.d.ts.map
