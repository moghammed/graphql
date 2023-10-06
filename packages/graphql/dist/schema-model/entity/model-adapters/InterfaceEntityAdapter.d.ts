import type { Annotations } from "../../annotation/Annotation";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { RelationshipAdapter } from "../../relationship/model-adapters/RelationshipAdapter";
import type { InterfaceEntity } from "../InterfaceEntity";
import { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
import { InterfaceEntityOperations } from "./InterfaceEntityOperations";
export declare class InterfaceEntityAdapter {
    readonly name: string;
    concreteEntities: ConcreteEntityAdapter[];
    readonly attributes: Map<string, AttributeAdapter>;
    readonly relationships: Map<string, RelationshipAdapter>;
    readonly annotations: Partial<Annotations>;
    private uniqueFieldsKeys;
    private _singular;
    private _plural;
    private _operations;
    constructor(entity: InterfaceEntity);
    findAttribute(name: string): AttributeAdapter | undefined;
    get globalIdField(): AttributeAdapter | undefined;
    private initConcreteEntities;
    private initAttributes;
    private initRelationships;
    get operations(): InterfaceEntityOperations;
    get singular(): string;
    get plural(): string;
    get upperFirstPlural(): string;
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get uniqueFields(): AttributeAdapter[];
    get sortableFields(): AttributeAdapter[];
    get whereFields(): AttributeAdapter[];
    get updateInputFields(): AttributeAdapter[];
    get subscriptionEventPayloadFields(): AttributeAdapter[];
    get subscriptionWhereFields(): AttributeAdapter[];
}
//# sourceMappingURL=InterfaceEntityAdapter.d.ts.map
