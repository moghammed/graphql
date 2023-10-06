import type { Annotations } from "../../annotation/Annotation";
import type { Argument } from "../../argument/Argument";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../entity/model-adapters/UnionEntityAdapter";
import type { NestedOperation, QueryDirection, Relationship, RelationshipDirection } from "../Relationship";
import { RelationshipOperations } from "./RelationshipOperations";
import { ListFiltersAdapter } from "../../attribute/model-adapters/ListFiltersAdapter";
export declare class RelationshipAdapter {
    private _listFiltersModel;
    readonly name: string;
    readonly type: string;
    readonly attributes: Map<string, AttributeAdapter>;
    readonly source: ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter;
    private rawEntity;
    private _target;
    readonly direction: RelationshipDirection;
    readonly queryDirection: QueryDirection;
    readonly nestedOperations: Set<NestedOperation>;
    readonly aggregate: boolean;
    readonly isNullable: boolean;
    readonly description?: string;
    readonly propertiesTypeName: string | undefined;
    readonly inheritedFrom: string | undefined;
    readonly isList: boolean;
    readonly annotations: Partial<Annotations>;
    readonly args: Argument[];
    private _singular;
    private _plural;
    private _operations;
    constructor(
        relationship: Relationship,
        sourceAdapter?: ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter
    );
    get operations(): RelationshipOperations;
    get listFiltersModel(): ListFiltersAdapter | undefined;
    get singular(): string;
    get plural(): string;
    private initAttributes;
    findAttribute(name: string): AttributeAdapter | undefined;
    /**
     * translation-only
     *
     * @param directed the direction asked during the query, for instance "friends(directed: true)"
     * @returns the direction to use in the CypherBuilder
     **/
    getCypherDirection(directed?: boolean): "left" | "right" | "undirected";
    private cypherDirectionFromRelDirection;
    get target(): ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter;
    isReadable(): boolean;
    isFilterableByValue(): boolean;
    isFilterableByAggregate(): boolean;
    isAggregable(): boolean;
    isCreatable(): boolean;
    isUpdatable(): boolean;
    shouldGenerateFieldInputType(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): boolean;
    shouldGenerateUpdateFieldInputType(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): boolean;
    get nonGeneratedProperties(): AttributeAdapter[];
    get hasNonNullNonGeneratedProperties(): boolean;
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get aggregableFields(): AttributeAdapter[];
    get aggregationWhereFields(): AttributeAdapter[];
    get createInputFields(): AttributeAdapter[];
    get updateInputFields(): AttributeAdapter[];
    get sortableFields(): AttributeAdapter[];
    get whereFields(): AttributeAdapter[];
    get subscriptionWhereFields(): AttributeAdapter[];
    get subscriptionConnectedRelationshipFields(): AttributeAdapter[];
}
//# sourceMappingURL=RelationshipAdapter.d.ts.map
