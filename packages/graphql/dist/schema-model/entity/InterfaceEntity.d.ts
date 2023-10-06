import type { Annotation, Annotations } from "../annotation/Annotation";
import type { Attribute } from "../attribute/Attribute";
import type { Relationship } from "../relationship/Relationship";
import type { CompositeEntity } from "./CompositeEntity";
import type { ConcreteEntity } from "./ConcreteEntity";
export declare class InterfaceEntity implements CompositeEntity {
    readonly name: string;
    readonly description?: string;
    readonly concreteEntities: ConcreteEntity[];
    readonly attributes: Map<string, Attribute>;
    readonly relationships: Map<string, Relationship>;
    readonly annotations: Partial<Annotations>;
    constructor({
        name,
        description,
        concreteEntities,
        attributes,
        annotations,
        relationships,
    }: {
        name: string;
        description?: string;
        concreteEntities: ConcreteEntity[];
        attributes?: Attribute[];
        annotations?: Annotation[];
        relationships?: Relationship[];
    });
    isConcreteEntity(): this is ConcreteEntity;
    isCompositeEntity(): this is CompositeEntity;
    private addAttribute;
    private addAnnotation;
    addRelationship(relationship: Relationship): void;
    findAttribute(name: string): Attribute | undefined;
    findRelationship(name: string): Relationship | undefined;
}
//# sourceMappingURL=InterfaceEntity.d.ts.map
