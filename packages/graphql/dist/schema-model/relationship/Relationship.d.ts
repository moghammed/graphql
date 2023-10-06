import type { RelationshipNestedOperationsOption, RelationshipQueryDirectionOption } from "../../constants";
import type { Annotation, Annotations } from "../annotation/Annotation";
import type { Argument } from "../argument/Argument";
import type { Attribute } from "../attribute/Attribute";
import type { Entity } from "../entity/Entity";
export type RelationshipDirection = "IN" | "OUT";
export type QueryDirection = keyof typeof RelationshipQueryDirectionOption;
export type NestedOperation = keyof typeof RelationshipNestedOperationsOption;
export declare class Relationship {
    readonly name: string;
    readonly type: string;
    readonly args: Argument[];
    readonly attributes: Map<string, Attribute>;
    readonly source: Entity;
    readonly target: Entity;
    readonly direction: RelationshipDirection;
    readonly isList: boolean;
    readonly queryDirection: QueryDirection;
    readonly nestedOperations: NestedOperation[];
    readonly aggregate: boolean;
    readonly isNullable: boolean;
    readonly description?: string;
    readonly annotations: Partial<Annotations>;
    readonly propertiesTypeName: string | undefined;
    readonly inheritedFrom: string | undefined;
    constructor({
        name,
        type,
        args,
        attributes,
        source,
        target,
        direction,
        isList,
        queryDirection,
        nestedOperations,
        aggregate,
        isNullable,
        description,
        annotations,
        propertiesTypeName,
        inheritedFrom,
    }: {
        name: string;
        type: string;
        args: Argument[];
        attributes?: Attribute[];
        source: Entity;
        target: Entity;
        direction: RelationshipDirection;
        isList: boolean;
        queryDirection: QueryDirection;
        nestedOperations: NestedOperation[];
        aggregate: boolean;
        isNullable: boolean;
        description?: string;
        annotations: Annotation[];
        propertiesTypeName?: string;
        inheritedFrom?: string;
    });
    clone(): Relationship;
    private addAnnotation;
    private addAttribute;
    findAttribute(name: string): Attribute | undefined;
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename(): string;
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename(): string;
}
//# sourceMappingURL=Relationship.d.ts.map
