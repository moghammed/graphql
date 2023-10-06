import type { Annotation, Annotations } from "./annotation/Annotation";
import type { Attribute } from "./attribute/Attribute";
export declare class Operation {
    readonly name: string;
    readonly attributes: Map<string, Attribute>;
    readonly annotations: Partial<Annotations>;
    constructor({
        name,
        attributes,
        annotations,
    }: {
        name: string;
        attributes?: Attribute[];
        annotations?: Annotation[];
    });
    findAttribute(name: string): Attribute | undefined;
    private addAttribute;
    private addAnnotation;
}
//# sourceMappingURL=Operation.d.ts.map
