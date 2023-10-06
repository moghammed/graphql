import { type Annotation, type Annotations } from "../annotation/Annotation";
import type { Argument } from "../argument/Argument";
import type { AttributeType } from "./AttributeType";
export declare class Attribute {
    readonly name: string;
    readonly annotations: Partial<Annotations>;
    readonly type: AttributeType;
    readonly databaseName: string;
    readonly description?: string;
    readonly args: Argument[];
    constructor({
        name,
        annotations,
        type,
        args,
        databaseName,
        description,
    }: {
        name: string;
        annotations: Annotation[];
        type: AttributeType;
        args: Argument[];
        databaseName?: string;
        description?: string;
    });
    clone(): Attribute;
    private addAnnotation;
}
//# sourceMappingURL=Attribute.d.ts.map